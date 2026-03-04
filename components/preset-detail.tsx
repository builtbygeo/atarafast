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
  const { t } = useLang()
  const [customHours, setCustomHours] = useState(16)
  const isCustom = preset.id === "custom"
  const displayHours = isCustom ? customHours : preset.fastHours
  const content = (t.planContent as any)?.[preset.id]

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
        <h2 className="text-lg font-bold tracking-tight text-foreground">{content?.name || preset.name}</h2>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">{t.tipsTitle}</h4>
        <div className="grid grid-cols-1 gap-3">
          {content?.tips.slice(0, 2).map((tip: string, i: number) => {
            const Icon = tipIcons[i % tipIcons.length]
            return (
              <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-secondary/5 border border-transparent">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background border border-border">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground/80 leading-snug pt-0.5">{tip}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
        <CircularProgress
          progress={isCustom ? 0.6 : preset.fastHours / 24}
          targetHours={displayHours}
          size={140}
          strokeWidth={10}
          color={preset.color}
        >
          <span className="text-2xl font-bold text-foreground font-mono">
            {isCustom ? `${customHours}${t.hours}` : preset.name}
          </span>
        </CircularProgress>

        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-sm px-2">
          {content?.desc}
        </p>

        {isCustom && (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <label htmlFor="custom-hours" className="text-sm font-medium text-foreground">
              {t.targetHours}
            </label>
            <input
              id="custom-hours"
              type="number"
              min={8}
              max={168}
              value={customHours}
              onChange={(e) => setCustomHours(Math.min(168, Math.max(8, Number(e.target.value))))}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-center text-xl font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {isActive ? (
          isCurrentActivePreset ? (
            <button
              onClick={onChangePreset}
              className="w-full max-w-xs rounded-xl bg-secondary px-6 py-4 text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
            >
              {t.changePreset}
            </button>
          ) : (
            <button
              onClick={() => onUpdateFast?.(displayHours)}
              className="w-full max-w-xs rounded-xl px-6 py-4 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
              style={{
                backgroundColor: preset.color,
                color: "white",
                boxShadow: `0 8px 16px -4px ${preset.color}40`
              }}
            >
              {t.changePreset} ({displayHours}{t.hours})
            </button>
          )
        ) : (
          <button
            onClick={() => onStart(displayHours)}
            className="w-full max-w-xs rounded-xl px-6 py-4 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
            style={{
              backgroundColor: preset.color,
              color: "white",
              boxShadow: `0 10px 20px -5px ${preset.color}50`
            }}
          >
            {t.startFast} ({displayHours}{t.hours})
          </button>
        )}
      </div>
    </div>
  )
}
