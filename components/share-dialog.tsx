"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toPng } from "html-to-image"
import { Download, Share2, X } from "lucide-react"
import { useLang } from "@/lib/language-context"
import { type FastingRecord } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"
import { QRCodeSVG } from "qrcode.react"

const APP_URL = "https://atarafast.com"
const APP_DOMAIN = "atarafast.com"

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
            className="relative flex flex-col items-center overflow-hidden"
            style={{
                width: 390,
                height: 693,
                background: "linear-gradient(160deg, #0a0a0a 0%, #0c180c 50%, #0a0a0a 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "10px 36px 40px",
            }}
        >
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #22c55e25 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -120, left: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, #f59e0b15 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Header - ABSURDLY MASSIVE Logo (520px) - God-Tier Branding */}
            <div style={{ position: "relative", zIndex: 5, marginTop: -95, marginBottom: -130 }}>
                <img 
                    src="/atara_c2.png" 
                    alt="Atara" 
                    style={{ height: 520, width: 520, objectFit: "contain", maxWidth: "none" }} 
                />
            </div>

            {/* Content Spacing - Airy & High End */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 10, width: "100%", marginTop: 20 }}>
                <p style={{ color: "#ffffff40", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.4em", marginBottom: 15 }}>
                    {isComplete ? t.shareAchieved : t.shareCurrent}
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 58, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", margin: 0 }}>
                    {formatHms(elapsedMs)}
                </h1>
                <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 800, marginTop: 18, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {preset?.name || presetId} · {targetHours} {t.hGoal || "h goal"}
                </p>
            </div>

            {/* Progress - More Space */}
            <div style={{ width: "100%", marginTop: 45, position: "relative", zIndex: 10 }}>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#ffffff10", marginBottom: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${Math.min(percentage, 100)}%`, background: isComplete ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                </div>
                <p style={{ textAlign: "center", color: "#ffffff40", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {Math.min(percentage, 100)}% {isComplete ? t.shareCompleted : t.shareProgress}
                </p>
            </div>

            {/* Phases - Symmetric & Clean */}
            <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 35, position: "relative", zIndex: 10 }}>
                {[
                    { label: t.shareSugar, color: "#f59e0b", pct: Math.min(100, (Math.min(elapsedMs / 3600000, 8) / 8) * 100) },
                    { label: t.shareTransition, color: "#fbbf24", pct: elapsedMs / 3600000 > 8 ? Math.min(100, ((Math.min(elapsedMs / 3600000, 12) - 8) / 4) * 100) : 0 },
                    { label: t.shareKetosis, color: "#22c55e", pct: elapsedMs / 3600000 > 12 ? Math.min(100, ((elapsedMs / 3600000 - 12) / Math.max(targetHours - 12, 1)) * 100) : 0 },
                ].map(({ label, color, pct }) => pct > 0 && (
                    <div key={label} style={{ flex: 1, padding: "14px 10px", borderRadius: 16, background: "#ffffff04", border: `1px solid ${color}20`, textAlign: "center" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, margin: "0 auto 8px" }} />
                        <p style={{ color: "#ffffff30", fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{label}</p>
                        <p style={{ color, fontSize: 15, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{Math.round(pct)}%</p>
                    </div>
                ))}
            </div>

            {/* Footer Group - Anchored & Professional */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 10 }}>
                <div style={{ background: "#ffffff", padding: 6, borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.9)" }}>
                    <QRCodeSVG value={APP_URL} size={78} level="H" bgColor="#ffffff" fgColor="#000000" />
                </div>
                <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#ffffff", fontSize: 10, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>
                        Atara - Fasting App
                    </p>
                    <p style={{ color: "#ffffff30", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", margin: 0 }}>
                        {APP_DOMAIN}
                    </p>
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
            className="relative flex flex-col items-center overflow-hidden"
            style={{
                width: 390,
                height: 693,
                background: "linear-gradient(160deg, #0a0a0a 0%, #0c180c 50%, #0a0a0a 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "10px 36px 40px",
            }}
        >
            <div style={{ position: "absolute", top: -140, left: "50%", transform: "translateX(-50%)", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #22c55e15 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Header - ABSURDLY MASSIVE Logo (520px) */}
            <div style={{ position: "relative", zIndex: 5, marginTop: -95, marginBottom: -130 }}>
                <img 
                    src="/atara_c2.png" 
                    alt="Atara" 
                    style={{ height: 520, width: 520, objectFit: "contain", maxWidth: "none" }} 
                />
            </div>

            <div style={{ textAlign: "center", position: "relative", zIndex: 10, width: "100%", marginTop: 25 }}>
                <p style={{ color: "#ffffff40", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.4em", marginBottom: 15 }}>
                    {t.shareAchievements}
                </p>
                <h1 style={{ color: "#ffffff", fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", margin: 0 }}>
                    {totalFasts} {t.shareFastsNum}
                </h1>
                <p style={{ color: "#22c55e", fontSize: 12, fontWeight: 800, marginTop: 18, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {formatHms(totalMs)} {t.shareTotal}
                </p>
            </div>

            {/* Stats Grid - Balanced Spacing */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginTop: 45, position: "relative", zIndex: 10 }}>
                {[
                    { icon: "🔥", label: t.shareStreak, value: `${streak} ${t.days || "дни"}` },
                    { icon: "⚡", label: t.shareAvgDuration, value: `${avgHours}ч` },
                    { icon: "✅", label: t.shareCompletedFasts, value: totalFasts },
                    { icon: "🕐", label: t.shareTotalHours, value: `${Math.round(totalMs / 3600000)}ч` },
                ].map(({ icon, label, value }) => (
                    <div key={label} style={{ padding: "18px 12px", borderRadius: 20, background: "#ffffff04", border: "1px solid #ffffff08", textAlign: "center" }}>
                        <p style={{ fontSize: 24, margin: "0 0 10px" }}>{icon}</p>
                        <p style={{ color: "#ffffff30", fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{label}</p>
                        <p style={{ color: "#ffffff", fontSize: 20, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Footer Group */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 10 }}>
                <div style={{ background: "#ffffff", padding: 6, borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.9)" }}>
                    <QRCodeSVG value={APP_URL} size={78} level="H" bgColor="#ffffff" fgColor="#000000" />
                </div>
                <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#ffffff", fontSize: 10, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>
                        Atara - Fasting App
                    </p>
                    <p style={{ color: "#ffffff30", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", margin: 0 }}>
                        {APP_DOMAIN}
                    </p>
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
                className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-start overflow-y-auto no-scrollbar pt-[max(3rem,env(safe-area-inset-top))] pb-20"
                onClick={props.onClose}
            >
                <div
                    className="flex flex-col items-center w-full"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Share Card Preview - God-Tier Scale Restoration */}
                    <div style={{ transform: "scale(0.8)", transformOrigin: "top center", marginBottom: -150, marginTop: 10 }}>
                        <div ref={cardRef} className="rounded-[40px] overflow-hidden shadow-[0_0_100px_-20px_rgba(34,197,94,0.3)] ring-1 ring-white/10 bg-black">
                            {props.type === "active" ? (
                                <ActiveShareCard {...props} />
                            ) : (
                                <StatsShareCard {...props} />
                            )}
                        </div>
                    </div>

                    {/* Highly Aesthetic Actions - Single Row Layout */}
                    <div className="flex items-center gap-3 w-full max-w-[340px] mt-8 px-4 relative z-[110]">
                        <button
                            onClick={() => captureAndShare(true)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[1.25rem] bg-secondary/80 border border-white/5 text-foreground font-black text-[11px] tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Download className="h-3.5 w-3.5" />
                            SAVE
                        </button>
                        
                        {typeof navigator !== "undefined" && "share" in navigator && (
                            <button
                                onClick={() => captureAndShare(false)}
                                disabled={loading}
                                className="flex-[1.5] flex items-center justify-center gap-2 h-12 rounded-[1.25rem] bg-primary text-primary-foreground font-black text-[11px] tracking-[0.2em] active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
                            >
                                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
                                SHARE
                            </button>
                        )}
                        
                        <button
                            onClick={props.onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-secondary/80 border border-white/5 text-white/40 active:scale-95 transition-all hover:text-white/80"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {shared && (
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-4">
                            {t.shareDone || "✓ Saved to gallery"}
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
