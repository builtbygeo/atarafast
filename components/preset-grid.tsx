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
        staggerChildren: 0.08,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 260, damping: 22 }
    },
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{t.selectPreset}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.selectSubtitle}</p>
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
                className="w-full relative flex flex-col items-center justify-center min-h-[120px] rounded-3xl p-5 text-center transition-all active:scale-[0.96] shadow-lg group overflow-hidden"
                style={{
                  backgroundColor: preset.color,
                  color: "white",
                  boxShadow: `0 10px 20px -5px ${preset.color}40`
                }}
              >
                {/* Subtle glass effect overlay */}
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />

                <span className="relative text-3xl font-black opacity-95 tracking-tighter">
                  {isCustom ? "?" : preset.name}
                </span>

                {isCustom && (
                  <div className="relative mt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                      {t.customFast}
                    </p>
                  </div>
                )}
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
