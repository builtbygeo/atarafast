"use client"

import { useLang } from "@/lib/language-context"
import { getPhaseData } from "@/lib/fasting-phases"

interface CircularProgressProps {
  progress: number // keep for backward compatibility, but we rely on elapsed/target
  elapsedHours?: number
  targetHours?: number
  size?: number
  strokeWidth?: number // base thickness of the thick track
  color?: string
  children?: React.ReactNode
}

export function CircularProgress({
  progress,
  elapsedHours = 0,
  targetHours = 16,
  size = 280,
  strokeWidth = 36,
  color = "oklch(var(--primary))",
  children,
}: CircularProgressProps) {
  const { t } = useLang()
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  const data = getPhaseData(targetHours, elapsedHours)

  // Make sure progress overlaps correctly (thin bright line)
  const progressPct = data.progressPct / 100
  const progressOffset = circumference * (1 - progressPct)

  // Math for arcs
  const sugarFrac = data.sugarPct / 100
  const transFrac = data.transitionPct / 100
  const ketoFrac = data.ketosisPct / 100

  // Rotation angles to stack the arcs smoothly. Top is -90 deg.
  const angleSugar = -90
  const angleTrans = -90 + (sugarFrac * 360)
  const angleKeto = -90 + ((sugarFrac + transFrac) * 360)

  // SVG dashoffsets to show exact fractions
  const offsetSugar = circumference * (1 - sugarFrac)
  const offsetTrans = circumference * (1 - transFrac)
  const offsetKeto = circumference * (1 - ketoFrac)

  return (
    <div className="relative inline-flex items-center justify-center pt-2" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track Circle (Empty Space) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/10"
        />

        {/* 1. Sugar (Orange) */}
        {sugarFrac > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-orange-500, #f59e0b)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offsetSugar}
            transform={`rotate(${angleSugar} ${center} ${center})`}
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* 2. Transition (Amber/Lighter) */}
        {transFrac > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-amber-400, #fbbf24)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offsetTrans}
            transform={`rotate(${angleTrans} ${center} ${center})`}
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* 3. Ketosis (Green) */}
        {ketoFrac > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-green-500, #22c55e)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offsetKeto}
            transform={`rotate(${angleKeto} ${center} ${center})`}
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Progress Arc (Thin Bright Line Overlay) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth / 4} // thin line
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: "drop-shadow(0 0 10px var(--color-primary-rgb))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>

      {/* Outside Labels */}
      <div className="flex flex-row justify-between w-[120%] absolute -bottom-8 px-4">
        {sugarFrac > 0 && <span className="text-[10px] sm:text-xs font-black text-orange-500 uppercase tracking-wider">{t?.phase1 || "ЗАХАР"} ({data.sugarPct}%)</span>}
        {transFrac > 0 && <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider">{t?.phase2 || "ПРЕХОД"} ({data.transitionPct}%)</span>}
        {ketoFrac > 0 && <span className="text-[10px] sm:text-xs font-black text-green-500 uppercase tracking-wider">{t?.phase3 || "КЕТОЗА И АВТОФАГИЯ"} ({data.ketosisPct}%)</span>}
      </div>
    </div>
  )
}
