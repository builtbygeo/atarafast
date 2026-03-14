"use client"

import { useState } from "react"
import { ArrowLeft, Droplets, Salad, Leaf } from "lucide-react"
import { CircularProgress } from "@/components/circular-progress"
import type { FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { useSubscription, startCheckout } from "@/lib/subscription"
import { ENABLE_PREMIUM } from "@/lib/features"
import { Lock } from "lucide-react"

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
  const { isPremium } = useSubscription()
  const [customInput, setCustomInput] = useState("16")
  const isCustom = preset.id === "custom"

  const parsedCustom = parseInt(customInput) || 16
  const displayHours = isCustom ? Math.min(168, Math.max(8, parsedCustom)) : preset.fastHours
  const content = (t.planContent as any)?.[preset.id]

  const isLocked = isCustom && !isPremium

  const tipIcons = [Droplets, Salad, Leaf, Droplets]

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-90 border border-border"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            {t.planTitle || "PLAN"}
          </span>
          <h2 className="text-lg font-black tracking-tight text-foreground uppercase">{content?.name || preset.name}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <div className="grid grid-cols-1 gap-2">
          {content?.tips.slice(0, 2).map((tip: string, i: number) => {
            const Icon = tipIcons[i % tipIcons.length]
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/50 border border-border">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground/80 leading-relaxed pt-0.5">{tip}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-1 pb-4">
        <div className="relative">
          <CircularProgress
            progress={isCustom ? 0.6 : preset.fastHours / 24}
            targetHours={displayHours}
            size={200}
            strokeWidth={14}
            color={preset.color}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-foreground font-mono tabular-nums leading-none tracking-tighter">
                {new Date(Date.now() + displayHours * 3600000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                {t.goal || "GOAL"}
              </span>
            </div>
          </CircularProgress>
          {/* Subtle Glow behind progress */}
          <div
            className="absolute inset-0 rounded-full blur-[40px] opacity-10 pointer-events-none"
            style={{ backgroundColor: preset.color }}
          />
        </div>

        <p className="text-sm font-medium text-muted-foreground text-center leading-relaxed max-w-xs px-4 opacity-80">
          {content?.desc}
        </p>

        {isCustom && (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs px-4">
            <label htmlFor="custom-hours" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
              {t.targetHours}
            </label>
            <div className="relative w-full">
              <input
                id="custom-hours"
                type="number"
                min={8}
                max={168}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onBlur={() => {
                  const val = parseInt(customInput) || 16
                  setCustomInput(String(Math.min(168, Math.max(8, val))))
                }}
                disabled={isLocked}
                className="w-full h-12 rounded-xl border border-border bg-secondary/20 px-3 py-2 text-center text-xl font-black font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-xs px-4 mt-1">
          {ENABLE_PREMIUM && isLocked ? (
            <button
              onClick={() => startCheckout()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl bg-secondary text-primary border border-primary/20"
            >
              <Lock className="w-3.5 h-3.5" />
              Upgrade to Atara Pro
            </button>
          ) : isActive ? (
            isCurrentActivePreset ? (
              <button
                onClick={onChangePreset}
                className="w-full py-3.5 rounded-2xl bg-secondary/50 border border-border text-xs font-black uppercase tracking-widest text-foreground transition-all hover:bg-secondary active:scale-95 shadow-md"
              >
                {t.changePreset}
              </button>
            ) : (
              <button
                onClick={() => onUpdateFast?.(displayHours)}
                className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl"
                style={{
                  backgroundColor: preset.color,
                  color: "#0f0f0f",
                  boxShadow: `0 8px 20px -8px ${preset.color}80`
                }}
              >
                {t.changePreset}
              </button>
            )
          ) : (
            <button
              onClick={() => onStart(displayHours)}
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl"
              style={{
                backgroundColor: preset.color,
                color: "#0f0f0f",
                boxShadow: `0 8px 20px -8px ${preset.color}80`
              }}
            >
              {t.startFast}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
