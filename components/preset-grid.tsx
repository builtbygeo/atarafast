"use client"

import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion } from "framer-motion"
import { useSubscription } from "@/lib/subscription"
import { Lock } from "lucide-react"

interface PresetGridProps {
  onSelect: (preset: FastingPreset) => void
  showHeader?: boolean
}

export function PresetGrid({ onSelect, showHeader = true }: PresetGridProps) {
  const { t, lang } = useLang()
  const { isPremium } = useSubscription()
  const allPresets = [...FASTING_PRESETS, CUSTOM_PRESET]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 25 }
    },
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {showHeader && (
        <header className="px-1">
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-[0.1em]">{t.selectPreset}</h2>
        </header>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {allPresets.map((preset) => {
          const isCustom = preset.id === "custom"
          const isLocked = isCustom && !isPremium
          const planName = (t.planContent as any)?.[preset.id]?.name || preset.name

          return (
            <motion.div key={preset.id} variants={item}>
              <button
                onClick={() => { if (!isLocked) onSelect(preset) }}
                className={`w-full relative flex flex-col items-center justify-center rounded-[2rem] p-8 text-center transition-all duration-500 ease-out active:scale-[0.96] border group overflow-hidden ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}
                style={{ 
                  background: `radial-gradient(circle at top left, color-mix(in oklch, ${preset.color}, transparent 80%), transparent), color-mix(in oklch, ${preset.color}, transparent 90%)`,
                  borderColor: `color-mix(in oklch, ${preset.color}, transparent 40%)`
                }}
              >
                {/* Premium Hover Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: preset.color }}
                />
                
                <div 
                  className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl -z-10"
                  style={{ backgroundColor: preset.color }}
                />

                {isLocked && (
                  <div className="absolute top-4 right-4 text-primary/40 bg-primary/5 p-1.5 rounded-full border border-border">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex flex-col items-center justify-center gap-1 w-full relative z-10">
                  <span className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 tabular-nums group-hover:scale-105 transition-transform duration-500">
                    {isCustom ? "?" : preset.name.replace(":", " : ")}
                  </span>
                  <span className="text-[11px] font-black text-foreground/60 uppercase tracking-[0.2em] leading-tight text-center group-hover:text-foreground transition-colors duration-500">
                    {planName}
                  </span>
                </div>

                {/* Subtle Radial Glow */}
                <div
                  className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ backgroundColor: preset.color }}
                />
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
