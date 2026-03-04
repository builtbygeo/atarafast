"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface TriangularProgressProps {
    progress: number // 0 to 1
    size?: number
    strokeWidth?: number
    color?: string
    children?: React.ReactNode
}

export function TriangularProgress({
    progress,
    size = 280,
    strokeWidth = 12,
    color = "oklch(var(--primary))",
    children,
}: TriangularProgressProps) {
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

    // Path string
    const path = `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${left.x} ${left.y} Z`

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-0">
                {/* Background Triangle */}
                <path
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/10"
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
                    animate={{ strokeDashoffset: totalLength * (1 - progress) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        filter: "drop-shadow(0 0 8px var(--color-primary-rgb))",
                    }}
                />

                {/* Vertex Dots */}
                <circle cx={top.x} cy={top.y} r={strokeWidth / 1.5} fill={progress >= 0.05 ? color : "currentColor"} className={progress < 0.05 ? "text-muted/20" : ""} />
                <circle cx={right.x} cy={right.y} r={strokeWidth / 1.5} fill={progress >= 0.33 ? color : "currentColor"} className={progress < 0.33 ? "text-muted/20" : ""} />
                <circle cx={left.x} cy={left.y} r={strokeWidth / 1.5} fill={progress >= 0.66 ? color : "currentColor"} className={progress < 0.66 ? "text-muted/20" : ""} />
            </svg>

            {/* Percentage Indicators based on segments (for visual debt) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[15%] text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest rotate-[30deg]">Phase 1 (50%)</div>
                <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">Phase 2 (25%)</div>
                <div className="absolute top-[20%] left-[15%] text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest -rotate-[30deg]">Phase 3 (25%)</div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                {children}
            </div>
        </div>
    )
}
