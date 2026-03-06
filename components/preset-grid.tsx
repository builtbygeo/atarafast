"use client"

import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion } from "framer-motion"

interface PresetGridProps {
  onSelect: (preset: FastingPreset) => void
  showHeader?: boolean
}

export function PresetGrid({ onSelect, showHeader = true }: PresetGridProps) {
  const { t } = useLang()
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
          <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-60">{t.selectSubtitle}</p>
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
          const planName = (t.planContent as any)?.[preset.id]?.name || preset.name

          return (
            <motion.div key={preset.id} variants={item}>
              <button
                onClick={() => onSelect(preset)}
                className="w-full relative flex flex-col rounded-[1.5rem] p-5 pt-4 text-left transition-all active:scale-[0.96] border border-white/10 bg-secondary/20 hover:bg-secondary/30 group overflow-hidden"
              >
                {/* Visual Indicator Line */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: preset.color }}
                />

                <div className="flex flex-col gap-0.5 pl-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-1">
                    {isCustom ? t.customFast : (t.fastLabel || "FAST")}
                  </span>
                  <span className="text-3xl font-black text-foreground tracking-tighter leading-none mb-2 tabular-nums">
                    {isCustom ? "?" : preset.name.replace(":", " : ")}
                  </span>
                  <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest leading-tight">
                    {planName}
                  </span>
                </div>

                {/* Subtle Glow */}
                <div
                  className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-opacity"
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
