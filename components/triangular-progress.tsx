"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import { useLang } from "@/lib/language-context"

import { getPhaseData } from "@/lib/fasting-phases"

interface TriangularProgressProps {
    elapsedHours: number
    targetHours: number
    size?: number
    strokeWidth?: number
    color?: string
    children?: React.ReactNode
}

export function TriangularProgress({
    elapsedHours,
    targetHours,
    size = 280,
    strokeWidth = 36,
    color = "oklch(var(--primary))",
    children,
}: TriangularProgressProps) {
    const { t } = useLang()
    const center = size / 2
    const padding = strokeWidth / 2 + 10

    // Triangle vertices (Equilateral-ish pointing up)
    const top = { x: center, y: padding }
    const right = { x: size - padding, y: size - padding }
    const left = { x: padding, y: size - padding }

    // Segment lengths
    const side1 = Math.sqrt(Math.pow(right.x - top.x, 2) + Math.pow(right.y - top.y, 2))
    const side2 = Math.sqrt(Math.pow(left.x - right.x, 2) + Math.pow(left.y - right.y, 2))
    const side3 = Math.sqrt(Math.pow(top.x - left.x, 2) + Math.pow(top.y - left.y, 2))
    const totalLength = side1 + side2 + side3

    // Math for Visual Progress mapping to medical phases structurally
    // Side 1 (Right): 0 - 8 hours
    // Side 2 (Bottom): 8 - 12 hours
    // Side 3 (Left): 12+ hours

    let visualProgress = 0
    const clampedElapsed = Math.min(elapsedHours, targetHours)

    if (clampedElapsed <= 8) {
        visualProgress = (clampedElapsed / 8) * (1 / 3)
    } else if (clampedElapsed <= 12) {
        visualProgress = (1 / 3) + ((clampedElapsed - 8) / 4) * (1 / 3)
    } else {
        const hoursInPhase3 = Math.max(0, targetHours - 12)
        const elapsedInPhase3 = clampedElapsed - 12
        visualProgress = hoursInPhase3 > 0 ? (2 / 3) + (elapsedInPhase3 / hoursInPhase3) * (1 / 3) : (2 / 3)
    }

    const data = getPhaseData(targetHours, elapsedHours)
    const continuousPath = `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${left.x} ${left.y} Z`

    return (
        <div className="flex flex-col items-center">
            {/* SVG Canvas */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" overflow="visible">
                    {/* Glow filters */}
                    <defs>
                        <filter id="tri-glow-orange" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="tri-glow-amber" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="tri-glow-green" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="tri-glow-white" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Background Triangle Track (Faint) */}
                    <path
                        d={continuousPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Side 2 — Transition base (Bottom: Right → Left) — drawn first */}
                    <path
                        d={`M ${right.x} ${right.y} L ${left.x} ${left.y}`}
                        fill="none"
                        stroke={data.transitionHours > 0 ? "#fbbf24" : "rgba(255,255,255,0.02)"}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={data.transitionHours > 0 ? "url(#tri-glow-amber)" : undefined}
                    />

                    {/* Side 1 — Sugar (Right side: Top → Right) — drawn second */}
                    <path
                        d={`M ${top.x} ${top.y} L ${right.x} ${right.y}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#tri-glow-orange)"
                    />

                    {/* Side 3 — Ketosis (Left side: Left → Top) — drawn LAST so it appears on top */}
                    <path
                        d={`M ${left.x} ${left.y} L ${top.x} ${top.y}`}
                        fill="none"
                        stroke={data.ketosisHours > 0 ? "#22c55e" : "rgba(255,255,255,0.1)"}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={data.ketosisHours > 0 ? "url(#tri-glow-green)" : undefined}
                    />

                    {/* Progress Overlay (Thin WHITE Line) */}
                    <motion.path
                        d={continuousPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth={strokeWidth / 5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={totalLength}
                        initial={{ strokeDashoffset: totalLength }}
                        animate={{ strokeDashoffset: totalLength * (1 - visualProgress) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        filter="url(#tri-glow-white)"
                    />
                </svg>

                {/* Timer content — sits in the lower-center safe zone of the triangle */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-[18%] z-10">
                    {children}
                </div>
            </div>

            {/* Phase Legend — outside SVG, stacks below */}
            <div className="flex flex-row items-start justify-center gap-4 mt-3 w-full">
                <div className="flex flex-col items-center gap-0.5">
                    <span className="w-3 h-1 rounded-full bg-orange-500 block" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-orange-500 uppercase tracking-wider">{t?.phase1 || "ЗАХАР"}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">{data.sugarPct}%</span>
                </div>
                {data.transitionHours > 0 && (
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="w-3 h-1 rounded-full bg-amber-400 block" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">{t?.phase2 || "ПРЕХОД"}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{data.transitionPct}%</span>
                    </div>
                )}
                {data.ketosisHours > 0 && (
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="w-3 h-1 rounded-full bg-green-500 block" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-green-500 uppercase tracking-wider">{t?.phase3 || "КЕТОЗА"}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{data.ketosisPct}%</span>
                    </div>
                )}
            </div>
        </div>
    )
}

