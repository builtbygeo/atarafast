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
    <div className="inline-flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Glow filters */}
          <defs>
            <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-white" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

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
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offsetSugar}
              transform={`rotate(${angleSugar} ${center} ${center})`}
              className="transition-all duration-1000 ease-out"
              filter="url(#glow-orange)"
            />
          )}

          {/* 2. Transition (Amber/Lighter) */}
          {transFrac > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offsetTrans}
              transform={`rotate(${angleTrans} ${center} ${center})`}
              className="transition-all duration-1000 ease-out"
              filter="url(#glow-amber)"
            />
          )}

          {/* 3. Ketosis (Green) */}
          {ketoFrac > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offsetKeto}
              transform={`rotate(${angleKeto} ${center} ${center})`}
              className="transition-all duration-1000 ease-out"
              filter="url(#glow-green)"
            />
          )}

          {/* Progress Arc (Thin WHITE Line Overlay) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth / 5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-1000 ease-out"
            filter="url(#glow-white)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>

      {/* Phase Labels Below Circle */}
      <div className="flex flex-row items-start justify-center gap-4 mt-4 w-full">
        {sugarFrac > 0 && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="w-3 h-1 rounded-full bg-orange-500 block" />
            <span className="text-[9px] sm:text-[10px] font-bold text-orange-500 uppercase tracking-wider">{t?.phase1 || "ЗАХАР"}</span>
            <span className="text-[9px] text-muted-foreground font-mono">{data.sugarPct}%</span>
          </div>
        )}
        {transFrac > 0 && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="w-3 h-1 rounded-full bg-amber-400 block" />
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">{t?.phase2 || "ПРЕХОД"}</span>
            <span className="text-[9px] text-muted-foreground font-mono">{data.transitionPct}%</span>
          </div>
        )}
        {ketoFrac > 0 && (
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
