"use client"

import { useState } from "react"
import { ArrowLeft, Droplets, Salad, Leaf } from "lucide-react"
import { CircularProgress } from "@/components/circular-progress"
import type { FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { useSubscription, startCheckout } from "@/lib/subscription"
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
    <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-32 px-1">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-90 border border-white/5"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            {t.planTitle || "PLAN"}
          </span>
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-tight">{content?.name || preset.name}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 border-b border-white/5 pb-2">
          {t.tipsTitle}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {content?.tips.slice(0, 2).map((tip: string, i: number) => {
            const Icon = tipIcons[i % tipIcons.length]
            return (
              <div key={i} className="flex items-start gap-4 p-4 rounded-[1.5rem] bg-secondary/20 border border-white/5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/50 border border-white/5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed pt-0.5">{tip}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 mt-4 pb-12">
        <div className="relative">
          <CircularProgress
            progress={isCustom ? 0.6 : preset.fastHours / 24}
            targetHours={displayHours}
            size={160}
            strokeWidth={12}
            color={preset.color}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-foreground font-mono tabular-nums leading-none tracking-tighter">
                {new Date(Date.now() + displayHours * 3600000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">
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

        <p className="text-sm font-medium text-muted-foreground text-center leading-relaxed max-w-sm px-4 opacity-80">
          {content?.desc}
        </p>

        {isCustom && (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs px-4">
            <label htmlFor="custom-hours" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
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
                className="w-full h-14 rounded-2xl border border-white/10 bg-secondary/20 px-3 py-2 text-center text-2xl font-black font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-xs px-4 mt-2">
          {isLocked ? (
            <button
              onClick={() => startCheckout()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-2xl bg-secondary text-primary border border-primary/20"
            >
              <Lock className="w-4 h-4" />
              Upgrade to Atara+
            </button>
          ) : isActive ? (
            isCurrentActivePreset ? (
              <button
                onClick={onChangePreset}
                className="w-full py-4 rounded-[2rem] bg-secondary/50 border border-white/10 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-secondary active:scale-95 shadow-lg"
              >
                {t.changePreset}
              </button>
            ) : (
              <button
                onClick={() => onUpdateFast?.(displayHours)}
                className="w-full py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-2xl"
                style={{
                  backgroundColor: preset.color,
                  color: "#0f0f0f",
                  boxShadow: `0 10px 30px -10px ${preset.color}80`
                }}
              >
                {t.changePreset}
              </button>
            )
          ) : (
            <button
              onClick={() => onStart(displayHours)}
              className="w-full py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-2xl"
              style={{
                backgroundColor: preset.color,
                color: "#0f0f0f",
                boxShadow: `0 10px 30px -10px ${preset.color}80`
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
