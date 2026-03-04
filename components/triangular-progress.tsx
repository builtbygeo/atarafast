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
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
                {/* Glow filters */}
                <defs>
                    <filter id="tri-glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="tri-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="tri-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="tri-glow-white" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <path id="path-right" d={`M ${top.x} ${top.y} L ${right.x} ${right.y}`} />
                    <path id="path-bottom" d={`M ${left.x} ${left.y} L ${right.x} ${right.y}`} />
                    <path id="path-left" d={`M ${left.x} ${left.y} L ${top.x} ${top.y}`} />
                </defs>

                {/* 1. Sugar Phase (Right Side) */}
                <path
                    d={`M ${top.x} ${top.y} L ${right.x} ${right.y}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#tri-glow-orange)"
                />

                {/* 2. Transition Phase (Bottom Side) */}
                {data.transitionHours > 0 && (
                    <path
                        d={`M ${right.x} ${right.y} L ${left.x} ${left.y}`}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#tri-glow-amber)"
                    />
                )}

                {/* 3. Ketosis Phase (Left Side) */}
                {data.ketosisHours > 0 && (
                    <path
                        d={`M ${left.x} ${left.y} L ${top.x} ${top.y}`}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#tri-glow-green)"
                    />
                )}

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

                {/* Phase 1 Label - Text ON the right stroke */}
                <text fill="white" className="text-[9px] sm:text-[10px] font-black tracking-widest" dy="4">
                    <textPath href="#path-right" startOffset="50%" textAnchor="middle">
                        {t?.phase1 || "ЗАХАР"} ({data.sugarPct}%)
                    </textPath>
                </text>

                {/* Phase 2 Label - Text ON the bottom stroke */}
                {data.transitionHours > 0 && (
                    <text fill="white" className="text-[9px] sm:text-[10px] font-black tracking-widest" dy="4">
                        <textPath href="#path-bottom" startOffset="50%" textAnchor="middle">
                            {t?.phase2 || "ПРЕХОД"} ({data.transitionPct}%)
                        </textPath>
                    </text>
                )}

                {/* Phase 3 Label - Text ON the left stroke */}
                {data.ketosisHours > 0 && (
                    <text fill="white" className="text-[9px] sm:text-[10px] font-black tracking-widest" dy="4">
                        <textPath href="#path-left" startOffset="50%" textAnchor="middle">
                            {t?.phase3 || "КЕТОЗА"} ({data.ketosisPct}%)
                        </textPath>
                    </text>
                )}
            </svg>

            {/* Children centered in safe zone (lower 60% of triangle) */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-[22%] z-10">
                {children}
            </div>
        </div>
    )
}
