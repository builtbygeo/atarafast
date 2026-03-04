"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import { useLang } from "@/lib/language-context"

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
    strokeWidth = 12,
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

    // Math for Visual Progress mapping to medical phases
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

    // Math for percentages
    // Phase 1 (0-8h)
    const p1Hours = Math.min(8, targetHours)
    const p1Pct = Math.round((p1Hours / targetHours) * 100)

    // Phase 2 (8-12h)
    const p2Hours = Math.max(0, Math.min(12, targetHours) - p1Hours)
    const p2Pct = Math.round((p2Hours / targetHours) * 100)

    // Phase 3 (12h+)
    const p3Hours = Math.max(0, targetHours - (p1Hours + p2Hours))
    const p3Pct = Math.round((p3Hours / targetHours) * 100)

    // Path string
    const path = `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${left.x} ${left.y} Z`

    return (
        <div className="relative flex items-center justify-center pt-4" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-0 absolute -top-4">
                {/* Background Triangle */}
                <path
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/10 opacity-50"
                    strokeLinejoin="round"
                />

                {/* Progress Triangle */}
                <motion.path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={totalLength}
                    initial={{ strokeDashoffset: totalLength }}
                    animate={{ strokeDashoffset: totalLength * (1 - visualProgress) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        filter: "drop-shadow(0 0 8px var(--color-primary-rgb))",
                    }}
                />

                {/* Vertex Dots */}
                <circle cx={top.x} cy={top.y} r={strokeWidth / 1.5} fill={visualProgress > 0 ? color : "currentColor"} className={visualProgress === 0 ? "text-muted/20" : ""} />
                <circle cx={right.x} cy={right.y} r={strokeWidth / 1.5} fill={visualProgress >= 0.33 ? color : "currentColor"} className={visualProgress < 0.33 ? "text-muted/20" : ""} />
                <circle cx={left.x} cy={left.y} r={strokeWidth / 1.5} fill={visualProgress >= 0.66 ? color : "currentColor"} className={visualProgress < 0.66 ? "text-muted/20" : ""} />
            </svg>

            {/* Percentage Indicators based on segments */}
            <div className="absolute inset-0 pointer-events-none -top-4">
                <div className="absolute top-[8%] right-[0%] text-[10px] sm:text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest rotate-[60deg] origin-bottom-left whitespace-nowrap">
                    {t?.phase1 || "ЗАХАР"} ({p1Pct}%)
                </div>
                {p2Hours > 0 && (
                    <div className="absolute -bottom-[2%] left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest whitespace-nowrap">
                        {t?.phase2 || "ПРЕХОД"} ({p2Pct}%)
                    </div>
                )}
                {p3Hours > 0 && (
                    <div className="absolute top-[8%] left-[0%] text-[10px] sm:text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest -rotate-[60deg] origin-bottom-right whitespace-nowrap">
                        {t?.phase3 || "КЕТОЗА И АВТОФАГИЯ"} ({p3Pct}%)
                    </div>
                )}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 z-10">
                {children}
            </div>
        </div>
    )
}
