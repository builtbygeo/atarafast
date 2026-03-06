"use client"

import { useLang } from "@/lib/language-context"
import { getPhaseData } from "@/lib/fasting-phases"

interface CircularProgressProps {
  progress: number
  elapsedHours?: number
  targetHours?: number
  size?: number
  strokeWidth?: number
  color?: string
  children?: React.ReactNode
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  // 0 degrees is Top, positive goes Clockwise
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ")
}

function describeTextArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const midAngle = (startAngle + endAngle) / 2
  const normalizedMid = ((midAngle % 360) + 360) % 360

  if (normalizedMid > 90 && normalizedMid < 270) {
    // Bottom half: counter-clockwise
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")
  } else {
    // Top half: clockwise
    const start = polarToCartesian(x, y, radius, startAngle)
    const end = polarToCartesian(x, y, radius, endAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ")
  }
}

export function CircularProgress({
  progress,
  elapsedHours = 0,
  targetHours = 16,
  size = 320,
  strokeWidth = 22,
  children,
}: CircularProgressProps) {
  const { t } = useLang()

  const outerRadius = size / 2
  const padding = strokeWidth / 2 + 14 // Increased padding for glow breathing room
  const trackRadius = outerRadius - padding
  const center = size / 2

  const data = getPhaseData(targetHours, elapsedHours)

  const gapDeg = 4 // Smaller gap for better curvature continuity
  const numPhases = (data.sugarPct > 0 ? 1 : 0) + (data.transitionPct > 0 ? 1 : 0) + (data.ketosisPct > 0 ? 1 : 0)
  const availableDeg = 360 - (numPhases > 0 ? numPhases * gapDeg : 0)

  // Calculate angles for segments
  let currentAngle = gapDeg / 2

  const arcs = []

  // 1. SUGAR (Orange)
  if (data.sugarPct > 0) {
    const angleSpan = (data.sugarPct / 100) * availableDeg
    arcs.push({
      id: "sugar",
      label: t?.phase1 || "SUGAR",
      color: "#f97316", // Orange
      start: currentAngle,
      end: currentAngle + angleSpan,
      mid: currentAngle + angleSpan / 2
    })
    currentAngle += angleSpan + gapDeg
  }

  // 2. TRANSITION (Yellow/Amber)
  if (data.transitionPct > 0) {
    const angleSpan = (data.transitionPct / 100) * availableDeg
    arcs.push({
      id: "trans",
      label: t?.phase2 || "TRANSITION",
      color: "#facc15", // Yellow
      start: currentAngle,
      end: currentAngle + angleSpan,
      mid: currentAngle + angleSpan / 2
    })
    currentAngle += angleSpan + gapDeg
  }

  // 3. KETOSIS (Green)
  if (data.ketosisPct > 0) {
    const angleSpan = (data.ketosisPct / 100) * availableDeg
    arcs.push({
      id: "keto",
      label: t?.phase3 || "KETOSIS",
      color: "#22c55e", // Green
      start: currentAngle,
      end: currentAngle + angleSpan,
      mid: currentAngle + angleSpan / 2
    })
  }

  // Progress dot position
  const progressDeg = (data.progressPct / 100) * 360
  const dotPos = polarToCartesian(center, center, trackRadius + padding - 4, progressDeg)

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 block overflow-visible">
        <defs>
          <filter id="arc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {arcs.map(arc => (
            <path
              key={`tp-${arc.id}`}
              id={`text-path-${arc.id}`}
              d={describeTextArc(center, center, trackRadius, arc.start, arc.end)}
              fill="none"
              stroke="none"
            />
          ))}
        </defs>

        {/* Thin Background Track */}
        <circle cx={center} cy={center} r={trackRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />

        {/* Outer progress rail (Thin Ring) */}
        <circle cx={center} cy={center} r={trackRadius + padding - 4} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Arc Segments */}
        {arcs.map(arc => (
          <path
            key={arc.id}
            d={describeArc(center, center, trackRadius, arc.start, arc.end)}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#arc-glow)"
            className="transition-all duration-1000 ease-out"
          />
        ))}

        {/* Outer Thin Progress Line overlay */}
        <path
          d={describeArc(center, center, trackRadius + padding - 4, 0, progressDeg)}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="1.5"
          className="transition-all duration-1000 ease-out"
        />

        {/* Target indicator (Dot with line) */}
        <circle cx={dotPos.x} cy={dotPos.y} r="3" fill="var(--foreground)" className="transition-all duration-1000" />
        <line
          x1={polarToCartesian(center, center, trackRadius, progressDeg).x}
          y1={polarToCartesian(center, center, trackRadius, progressDeg).y}
          x2={dotPos.x}
          y2={dotPos.y}
          stroke="var(--foreground)"
          strokeWidth="1.5"
          className="transition-all duration-1000"
        />
        {/* Embedded Text Labels on rings */}
        {arcs.map(arc => (
          <text
            key={`txt-${arc.id}`}
            className="font-bold text-[10px] tracking-[0.15em] uppercase pointer-events-none mix-blend-overlay transition-all duration-1000"
            fill="rgba(0,0,0,0.65)"
            dy="0.32em"
          >
            <textPath href={`#text-path-${arc.id}`} startOffset="50%" textAnchor="middle">
              {arc.label}
            </textPath>
          </text>
        ))}
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        {children}
      </div>
    </div>
  )
}
