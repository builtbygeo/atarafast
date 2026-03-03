"use client"

import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion } from "framer-motion"

interface PresetGridProps {
  onSelect: (preset: FastingPreset) => void
}

export function PresetGrid({ onSelect }: PresetGridProps) {
  const allPresets = [...FASTING_PRESETS, CUSTOM_PRESET]


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Choose a fast</h2>
        <p className="text-sm text-muted-foreground mt-1">Select a preset to get started</p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {allPresets.map((preset) => (
          <motion.div key={preset.id} variants={item}>
            <button
              onClick={() => onSelect(preset)}
              className="w-full group relative flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.98]"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: preset.color,
                  color: "white",
                }}
              >
                {preset.id === "custom" ? "?" : preset.fastHours}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{preset.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {preset.id === "custom"
                    ? "1\u2013168 hours"
                    : `${preset.fastHours}h fast \u00b7 ${preset.eatHours}h eat`}
                </p>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
