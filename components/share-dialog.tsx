"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toPng } from "html-to-image"
import { Download, Share2, X, Flame, Trophy, Zap } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { type FastingRecord } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"
import { QRCodeSVG } from "qrcode.react"

const APP_URL = "https://app.atarafast.com"

interface FastShareCardProps {
    type: "active"
    elapsedMs: number
    targetHours: number
    presetId: string
    percentage: number
}

interface StatsShareCardProps {
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
                height: 693,
                background: "linear-gradient(160deg, #0a0a0a 0%, #0f1a0f 60%, #0a0a0a 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "60px 36px 48px",
            }}
        >
            <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #22c55e30 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #f59e0b20 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Header - Centered Logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                <img src="/atara_c2.png" alt="Atara" style={{ height: 90, width: "auto" }} />
            </div>

            <div style={{ marginTop: -10 }}>
                <p style={{ color: "#ffffff60", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10 }}>
                    {isComplete ? t.shareAchieved : t.shareCurrent}
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 54, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>
                    {formatHms(elapsedMs)}
                </h1>
                <p style={{ color: "#22c55e", fontSize: 16, fontWeight: 700, marginTop: 12, letterSpacing: "0.05em" }}>
                    {preset?.name || presetId} · {targetHours} {t.hGoal || "h goal"}
                </p>
            </div>

            {/* Progress */}
            <div>
                <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#ffffff15", marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(percentage, 100)}%`, background: isComplete ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                </div>
                <p style={{ color: "#ffffff60", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em" }}>
                    {Math.min(percentage, 100)}% {isComplete ? t.shareCompleted : t.shareProgress}
                </p>
            </div>

            {/* Phases */}
            <div style={{ display: "flex", gap: 8 }}>
                {[
                    { label: t.shareSugar, color: "#f59e0b", pct: Math.min(100, (Math.min(elapsedMs / 3600000, 8) / 8) * 100) },
                    { label: t.shareTransition, color: "#fbbf24", pct: elapsedMs / 3600000 > 8 ? Math.min(100, ((Math.min(elapsedMs / 3600000, 12) - 8) / 4) * 100) : 0 },
                    { label: t.shareKetosis, color: "#22c55e", pct: elapsedMs / 3600000 > 12 ? Math.min(100, ((elapsedMs / 3600000 - 12) / Math.max(targetHours - 12, 1)) * 100) : 0 },
                ].map(({ label, color, pct }) => pct > 0 && (
                    <div key={label} style={{ flex: 1, padding: "10px 12px", borderRadius: 12, background: "#ffffff08", border: `1px solid ${color}30` }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginBottom: 6 }} />
                        <p style={{ color: "#ffffff80", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{label}</p>
                        <p style={{ color, fontSize: 14, fontWeight: 900, margin: "2px 0 0" }}>{Math.round(pct)}%</p>
                    </div>
                ))}
            </div>

            {/* Footer with ENLARGED QR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24 }}>
                <div style={{ textAlign: "left" }}>
                    <p style={{ color: "#ffffff70", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 3 }}>
                        ATARA · FASTING APP
                    </p>
                    <p style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
                        app.atarafast.com
                    </p>
                </div>
                <div style={{ background: "#ffffff", padding: 8, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
                    <QRCodeSVG value={APP_URL} size={84} level="H" bgColor="#ffffff" fgColor="#000000" />
                </div>
            </div>
        </div>
    )
}

function StatsShareCard({ history }: Omit<StatsShareCardProps, "type">) {
    const { t } = useLang()
    const completed = history.filter(h => h.completed)
    const totalFasts = completed.length
    const totalMs = completed.reduce((acc, r) => r.endTime ? acc + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) : acc, 0)
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
                padding: "60px 36px 48px",
            }}
        >
            <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #22c55e20 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Header - Centered Logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
                <img src="/atara_c2.png" alt="Atara" style={{ height: 90, width: "auto" }} />
            </div>

            <div style={{ marginTop: -10 }}>
                <p style={{ color: "#ffffff60", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
                    {t.shareAchievements}
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 48, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>
                    {totalFasts} {t.shareFastsNum}
                </h1>
                <p style={{ color: "#22c55e", fontSize: 15, fontWeight: 700, marginTop: 10 }}>
                    {formatHms(totalMs)} {t.shareTotal}
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                    { icon: "🔥", label: t.shareStreak, value: `${streak} ${t.days || "дни"}` },
                    { icon: "⚡", label: t.shareAvgDuration, value: `${avgHours}ч` },
                    { icon: "✅", label: t.shareCompletedFasts, value: totalFasts },
                    { icon: "🕐", label: t.shareTotalHours, value: `${Math.round(totalMs / 3600000)}ч` },
                ].map(({ icon, label, value }) => (
                    <div key={label} style={{ padding: "16px", borderRadius: 16, background: "#ffffff06", border: "1px solid #ffffff10" }}>
                        <p style={{ fontSize: 22, margin: "0 0 6px" }}>{icon}</p>
                        <p style={{ color: "#ffffff60", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{label}</p>
                        <p style={{ color: "#ffffff", fontSize: 20, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Footer with ENLARGED QR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24 }}>
                <div style={{ textAlign: "left" }}>
                    <p style={{ color: "#ffffff70", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 3 }}>
                        ATARA · FASTING APP
                    </p>
                    <p style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
                        app.atarafast.com
                    </p>
                </div>
                <div style={{ background: "#ffffff", padding: 8, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
                    <QRCodeSVG value={APP_URL} size={84} level="H" bgColor="#ffffff" fgColor="#000000" />
                </div>
            </div>
        </div>
    )
}

export function ShareDialog(props: ShareDialogProps) {
    const { t } = useLang()
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
                a.download = "atara-share.png"
                a.click()
                setShared(true)
            } else {
                const res = await fetch(dataUrl)
                const blob = await res.blob()
                const file = new File([blob], "atara-share.png", { type: "image/png" })
                await navigator.share({ files: [file] })
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
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start overflow-y-auto no-scrollbar pt-10 pb-20"
                onClick={props.onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="flex flex-col items-center gap-6 w-full max-w-[360px] px-4"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Share Card Preview - Scaled slightly more to fit larger logo/QR room */}
                    <div style={{ transform: "scale(0.7)", transformOrigin: "top center", marginBottom: -210 }}>
                        <div ref={cardRef} className="rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                            {props.type === "active" ? (
                                <ActiveShareCard {...props} />
                            ) : (
                                <StatsShareCard {...props} />
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full mt-4">
                        <div className="flex gap-3">
                            {typeof navigator !== "undefined" && "share" in navigator && (
                                <button
                                    onClick={() => captureAndShare(false)}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-3 h-14 rounded-[1.25rem] bg-primary text-primary-foreground font-black text-sm tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 className="h-5 w-5" />}
                                    {t.shareButton || "SHARE"}
                                </button>
                            )}
                            <button
                                onClick={() => captureAndShare(true)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-3 h-14 rounded-[1.25rem] bg-zinc-900 text-white font-black text-sm tracking-widest border border-white/5 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Download className="h-5 w-5" />
                                {t.saveButton || "SAVE"}
                            </button>
                        </div>

                        {shared && (
                            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">
                                {t.shareDone || "✓ Saved to gallery"}
                            </motion.p>
                        )}
                    </div>

                    <button
                        onClick={props.onClose}
                        className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] py-4 hover:text-white transition-colors"
                    >
                        <X className="h-3 w-3" />
                        {t.closeButton || "CLOSE"}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
