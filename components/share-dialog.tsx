"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toPng } from "html-to-image"
import { Download, Share2, X, Flame, Trophy, Zap } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { type FastingRecord } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"

interface FastShareCardProps {
    // Active fast share
    type: "active"
    elapsedMs: number
    targetHours: number
    presetId: string
    percentage: number
}

interface StatsShareCardProps {
    // Stats / achievement share
    type: "stats"
    history: FastingRecord[]
}

type ShareDialogProps = {
    onClose: () => void
} & (FastShareCardProps | StatsShareCardProps)

function formatHms(ms: number) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
}

function ActiveShareCard({ elapsedMs, targetHours, presetId, percentage }: Omit<FastShareCardProps, "type">) {
    const { t } = useLang()
    const preset = getPresetById(presetId)
    const isComplete = percentage >= 100

    return (
        <div
            className="relative flex flex-col justify-between overflow-hidden"
            style={{
                width: 390,
                height: 693, // 9:16
                background: "linear-gradient(160deg, #0a0a0a 0%, #0f1a0f 60%, #0a0a0a 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "48px 36px",
            }}
        >
            {/* Background glow */}
            <div style={{
                position: "absolute", top: -60, right: -60, width: 280, height: 280,
                borderRadius: "50%", background: "radial-gradient(circle, #22c55e30 0%, transparent 70%)", pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", bottom: -80, left: -40, width: 260, height: 260,
                borderRadius: "50%", background: "radial-gradient(circle, #f59e0b20 0%, transparent 70%)", pointerEvents: "none"
            }} />

            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        border: "1.5px solid #22c55e60",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" /><path d="M12 8v4l2 2" />
                        </svg>
                    </div>
                    <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Atara
                    </span>
                </div>

                <p style={{ color: "#ffffff50", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10 }}>
                    {isComplete ? "ПОСТИГНАТО" : "В МОМЕНТА"}
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 54, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>
                    {formatHms(elapsedMs)}
                </h1>
                <p style={{ color: "#22c55e", fontSize: 16, fontWeight: 700, marginTop: 12, letterSpacing: "0.05em" }}>
                    {preset?.name || presetId} · {targetHours}ч цел
                </p>
            </div>

            {/* Progress bar */}
            <div>
                <div style={{
                    width: "100%", height: 6, borderRadius: 3, background: "#ffffff15", marginBottom: 8, overflow: "hidden"
                }}>
                    <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${Math.min(percentage, 100)}%`,
                        background: isComplete
                            ? "linear-gradient(90deg, #22c55e, #4ade80)"
                            : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    }} />
                </div>
                <p style={{ color: "#ffffff40", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em" }}>
                    {Math.min(percentage, 100)}% {isComplete ? "ЗАВЪРШЕНО 🎉" : "ПРОГРЕС"}
                </p>
            </div>

            {/* Phases */}
            <div style={{ display: "flex", gap: 8 }}>
                {[
                    { label: "Захар", color: "#f59e0b", pct: Math.min(100, (Math.min(elapsedMs / 3600000, 8) / 8) * 100) },
                    { label: "Преход", color: "#fbbf24", pct: elapsedMs / 3600000 > 8 ? Math.min(100, ((Math.min(elapsedMs / 3600000, 12) - 8) / 4) * 100) : 0 },
                    { label: "Кетоза", color: "#22c55e", pct: elapsedMs / 3600000 > 12 ? Math.min(100, ((elapsedMs / 3600000 - 12) / Math.max(targetHours - 12, 1)) * 100) : 0 },
                ].map(({ label, color, pct }) => pct > 0 && (
                    <div key={label} style={{
                        flex: 1, padding: "10px 12px", borderRadius: 12,
                        background: "#ffffff08", border: `1px solid ${color}30`,
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginBottom: 6 }} />
                        <p style={{ color: "#ffffff70", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{label}</p>
                        <p style={{ color, fontSize: 14, fontWeight: 900, margin: "2px 0 0" }}>{Math.round(pct)}%</p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center" }}>
                <p style={{ color: "#ffffff20", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em" }}>
                    ATARA · INTERMITTENT FASTING
                </p>
            </div>
        </div>
    )
}

function StatsShareCard({ history }: Omit<StatsShareCardProps, "type">) {
    const completed = history.filter(h => h.completed)
    const totalFasts = completed.length
    const totalMs = completed.reduce((acc, r) => {
        if (!r.endTime) return acc
        return acc + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime())
    }, 0)
    const avgHours = totalFasts > 0 ? Math.round((totalMs / totalFasts) / 3600000) : 0
    const streak = (() => {
        if (!completed.length) return 0
        const sorted = [...completed].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        let s = 1
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1].startTime)
            const curr = new Date(sorted[i].startTime)
            const diff = (prev.getTime() - curr.getTime()) / 86400000
            if (diff <= 2) s++; else break
        }
        return s
    })()

    return (
        <div
            className="relative flex flex-col justify-between overflow-hidden"
            style={{
                width: 390,
                height: 693,
                background: "linear-gradient(160deg, #0a0a0a 0%, #0f1a0f 60%, #0a0a0a 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "48px 36px",
            }}
        >
            {/* Background glow */}
            <div style={{
                position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320,
                borderRadius: "50%", background: "radial-gradient(circle, #22c55e20 0%, transparent 70%)", pointerEvents: "none"
            }} />

            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        border: "1.5px solid #22c55e60",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" /><path d="M12 8v4l2 2" />
                        </svg>
                    </div>
                    <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Atara
                    </span>
                </div>

                <p style={{ color: "#ffffff50", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
                    МОИТЕ ПОСТИЖЕНИЯ
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 48, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>
                    {totalFasts} фаста
                </h1>
                <p style={{ color: "#22c55e", fontSize: 15, fontWeight: 700, marginTop: 10 }}>
                    {formatHms(totalMs)} суммарно
                </p>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                    { icon: "🔥", label: "Серия", value: `${streak} дни` },
                    { icon: "⚡", label: "Ср. продължителност", value: `${avgHours}ч` },
                    { icon: "✅", label: "Завършени", value: totalFasts },
                    { icon: "🕐", label: "Общо часове", value: `${Math.round(totalMs / 3600000)}ч` },
                ].map(({ icon, label, value }) => (
                    <div key={label} style={{
                        padding: "16px", borderRadius: 16,
                        background: "#ffffff06", border: "1px solid #ffffff10",
                    }}>
                        <p style={{ fontSize: 22, margin: "0 0 6px" }}>{icon}</p>
                        <p style={{ color: "#ffffff40", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{label}</p>
                        <p style={{ color: "#ffffff", fontSize: 20, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center" }}>
                <p style={{ color: "#ffffff20", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em" }}>
                    ATARA · INTERMITTENT FASTING
                </p>
            </div>
        </div>
    )
}

export function ShareDialog(props: ShareDialogProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const [shared, setShared] = useState(false)

    const captureAndShare = useCallback(async (download = false) => {
        if (!cardRef.current) return
        setLoading(true)
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 })

            if (download || !navigator.share) {
                const a = document.createElement("a")
                a.href = dataUrl
                a.download = "atara-fast.png"
                a.click()
                setShared(true)
            } else {
                const res = await fetch(dataUrl)
                const blob = await res.blob()
                const file = new File([blob], "atara-fast.png", { type: "image/png" })
                await navigator.share({ files: [file], title: "Atara — My Fasting Journey" })
                setShared(true)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-4"
                onClick={props.onClose}
            >
                <motion.div
                    initial={{ scale: 0.88, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.88, opacity: 0, y: 40 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="flex flex-col items-center gap-5 w-full max-w-[360px]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Preview card - scaled down visually */}
                    <div
                        style={{ transform: "scale(0.85)", transformOrigin: "top center", marginBottom: -50, pointerEvents: "none" }}
                    >
                        <div ref={cardRef} className="rounded-[28px] overflow-hidden shadow-2xl">
                            {props.type === "active" ? (
                                <ActiveShareCard
                                    elapsedMs={props.elapsedMs}
                                    targetHours={props.targetHours}
                                    presetId={props.presetId}
                                    percentage={props.percentage}
                                />
                            ) : (
                                <StatsShareCard history={props.history} />
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        {typeof navigator !== "undefined" && "share" in navigator && (
                            <button
                                onClick={() => captureAndShare(false)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Share2 className="h-5 w-5" />
                                )}
                                Сподели
                            </button>
                        )}
                        <button
                            onClick={() => captureAndShare(true)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-secondary text-foreground font-black text-sm tracking-wide border border-border/50 active:scale-95 transition-all disabled:opacity-60"
                        >
                            <Download className="h-5 w-5" />
                            Запази
                        </button>
                    </div>

                    {shared && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-black text-primary/80 uppercase tracking-widest"
                        >
                            ✓ Готово!
                        </motion.p>
                    )}

                    <button
                        onClick={props.onClose}
                        className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60 py-2"
                    >
                        <X className="h-3 w-3" />
                        Затвори
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
