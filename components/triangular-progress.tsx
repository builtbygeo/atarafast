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
        <div className="relative flex items-center justify-center pt-4" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-0 absolute -top-4">
                {/* 1. Sugar Phase (Right Side) */}
                <path
                    d={`M ${top.x} ${top.y} L ${right.x} ${right.y}`}
                    fill="none"
                    stroke="var(--color-orange-500, #f59e0b)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* 2. Transition Phase (Bottom Side) */}
                {data.transitionHours > 0 && (
                    <path
                        d={`M ${right.x} ${right.y} L ${left.x} ${left.y}`}
                        fill="none"
                        stroke="var(--color-amber-400, #fbbf24)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* 3. Ketosis Phase (Left Side) - Only draw if Ketosis exists */}
                {data.ketosisHours > 0 && (
                    <path
                        d={`M ${left.x} ${left.y} L ${top.x} ${top.y}`}
                        fill="none"
                        stroke="var(--color-green-500, #22c55e)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* Progress Overlay (Thin Bright Line) */}
                <motion.path
                    d={continuousPath}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth / 4} // thin line
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={totalLength}
                    initial={{ strokeDashoffset: totalLength }}
                    animate={{ strokeDashoffset: totalLength * (1 - visualProgress) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        filter: "drop-shadow(0 0 10px var(--color-primary-rgb))",
                    }}
                />

                {/* 
                  Text Paths (drawn left-to-right or top-to-bottom so text isn't upside down) 
                  Side 1: Top to Right
                  Side 2: Left to Right (flipped so reading is left->right instead of right->left)
                  Side 3: Left to Top (flipped)
                */}
                <defs>
                    <path id="path-right" d={`M ${top.x} ${top.y} L ${right.x} ${right.y}`} />
                    <path id="path-bottom" d={`M ${left.x} ${left.y} L ${right.x} ${right.y}`} />
                    <path id="path-left" d={`M ${left.x} ${left.y} L ${top.x} ${top.y}`} />
                </defs>

                {/* Phase 1 Label - Text ON the right stroke */}
                <text fill="white" className="text-[10px] sm:text-[11px] font-black tracking-widest" dy="4">
                    <textPath href="#path-right" startOffset="50%" textAnchor="middle">
                        {t?.phase1 || "ЗАХАР"} ({data.sugarPct}%)
                    </textPath>
                </text>

                {/* Phase 2 Label - Text ON the bottom stroke */}
                {data.transitionHours > 0 && (
                    <text fill="white" className="text-[10px] sm:text-[11px] font-black tracking-widest" dy="4">
                        <textPath href="#path-bottom" startOffset="50%" textAnchor="middle">
                            {t?.phase2 || "ПРЕХОД"} ({data.transitionPct}%)
                        </textPath>
                    </text>
                )}

                {/* Phase 3 Label - Text ON the left stroke */}
                {data.ketosisHours > 0 && (
                    <text fill="white" className="text-[10px] sm:text-[11px] font-black tracking-widest" dy="4">
                        <textPath href="#path-left" startOffset="50%" textAnchor="middle">
                            {t?.phase3 || "КЕТОЗА И АВТОФАГИЯ"} ({data.ketosisPct}%)
                        </textPath>
                    </text>
                )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 z-10">
                {children}
            </div>
        </div>
    )
}
