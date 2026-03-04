"use client"

import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion } from "framer-motion"

interface PresetGridProps {
  onSelect: (preset: FastingPreset) => void
}

export function PresetGrid({ onSelect }: PresetGridProps) {
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
    <div className="flex flex-col gap-8 w-full">
      <header className="px-1">
        <h2 className="text-2xl font-black tracking-tight text-foreground">{t.selectPreset}</h2>
        <p className="text-sm font-medium text-muted-foreground mt-1.5 opacity-70">{t.selectSubtitle}</p>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {allPresets.map((preset) => {
          const isCustom = preset.id === "custom"
          return (
            <motion.div key={preset.id} variants={item}>
              <button
                onClick={() => onSelect(preset)}
                className="w-full relative flex flex-col items-center justify-center min-h-[140px] rounded-[2.5rem] p-6 text-center transition-all active:scale-[0.95] shadow-xl group overflow-hidden border border-white/10"
                style={{
                  backgroundColor: preset.color,
                  color: "white",
                  boxShadow: `0 12px 24px -8px ${preset.color}60`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex flex-col items-center justify-center gap-1.5 w-full">
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter drop-shadow-sm whitespace-nowrap tabular-nums leading-none">
                    {isCustom ? "?" : preset.name.replace(":", " : ")}
                  </span>

                  {isCustom ? (
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80 mt-1">
                      {t.customFast}
                    </p>
                  ) : (
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] opacity-90 mt-1">
                      {(t.planContent as any)?.[preset.id]?.name || preset.name}
                    </p>
                  )}
                </div>
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
