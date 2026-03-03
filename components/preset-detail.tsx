"use client"

import { useState } from "react"
import { ArrowLeft, Droplets, Salad, Leaf } from "lucide-react"
import { CircularProgress } from "@/components/circular-progress"
import type { FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"

interface PresetDetailProps {
  preset: FastingPreset
  isActive: boolean
  isCurrentActivePreset?: boolean
  onBack: () => void
  onStart: (hours: number) => void
  onChangePreset?: () => void
  onUpdateFast?: (hours: number) => void
}

export function PresetDetail({ preset, isActive, isCurrentActivePreset, onBack, onStart, onChangePreset, onUpdateFast }: PresetDetailProps) {
  const [customHours, setCustomHours] = useState(16)
  const isCustom = preset.id === "custom"
  const displayHours = isCustom ? customHours : preset.fastHours

  const tipIcons = [Droplets, Salad, Leaf, Droplets]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">{preset.name}</h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        <CircularProgress
          progress={isCustom ? 0.5 : preset.fastHours / 24}
          size={140}
          strokeWidth={8}
          color={preset.color}
        >
          <span className="text-xl font-bold text-foreground font-mono">
            {isCustom ? `${customHours}h` : preset.name}
          </span>
        </CircularProgress>

        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-sm">
          {preset.description}
        </p>

        {isCustom && (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <label htmlFor="custom-hours" className="text-sm font-medium text-foreground">
              Fasting duration (hours)
            </label>
            <input
              id="custom-hours"
              type="number"
              min={1}
              max={168}
              value={customHours}
              onChange={(e) => setCustomHours(Math.min(168, Math.max(1, Number(e.target.value))))}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-center text-lg font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {isActive ? (
          isCurrentActivePreset ? (
            <button
              onClick={onChangePreset}
              className="w-full max-w-xs rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Change preset
            </button>
          ) : (
            <button
              onClick={() => onUpdateFast?.(displayHours)}
              className="w-full max-w-xs rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: preset.color,
                color: "white",
              }}
            >
              Update to {displayHours}h fast
            </button>
          )
        ) : (
          <button
            onClick={() => onStart(displayHours)}
            className="w-full max-w-xs rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: preset.color,
              color: "white",
            }}
          >
            Start {displayHours}h fast
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {preset.tips.map((tip, i) => {
          const Icon = tipIcons[i % tipIcons.length]
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pt-1">{tip}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
