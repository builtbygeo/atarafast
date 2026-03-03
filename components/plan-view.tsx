"use client"

import { useState } from "react"
import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Info, Sparkles, X } from "lucide-react"

export function PlanView() {
  const { t } = useLang()
  const [selectedPlan, setSelectedPlan] = useState<FastingPreset | null>(null)

  const allPresets = [...FASTING_PRESETS, CUSTOM_PRESET]

  // Container variants for staggering the grid items
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
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
  }

  const renderGrid = () => (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{t.fastingPlans}</h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          {t.plansSubtitle}
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {allPresets.map((preset) => {
          const content = (t.planContent as any)?.[preset.id] || { name: preset.name }
          return (
            <motion.button
              key={preset.id}
              variants={item}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedPlan(preset)}
              className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 active:bg-secondary/20"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold shadow-lg"
                style={{
                  backgroundColor: preset.color,
                  color: "white",
                  boxShadow: `0 8px 16px -4px ${preset.color}40`
                }}
              >
                {preset.fastHours > 0 ? preset.fastHours : "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight italic">{content.name}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
                  {preset.fastHours > 0 ? `${preset.fastHours}:${preset.eatHours}` : "Custom"}
                </p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 p-5 rounded-2xl bg-secondary/5 border border-border/40 backdrop-blur-sm"
      >
        <div className="flex gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium">
            {t.planNote}
          </p>
        </div>
      </motion.div>
    </div>
  )

  const renderDetail = (preset: FastingPreset) => {
    const content = (t.planContent as any)?.[preset.id]
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        <header className="px-5 py-4 border-b border-border flex items-center gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => setSelectedPlan(null)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-foreground leading-none">{content?.name}</h3>
            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground mt-1 font-mono">
              {preset.fastHours > 0 ? `${preset.fastHours}h Fast \u2022 ${preset.eatHours}h Eat` : "Personal window"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-28 w-28 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-2xl relative"
              style={{ backgroundColor: preset.color, color: "white" }}
            >
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-primary" />
              {preset.fastHours > 0 ? preset.fastHours : "?"}
            </motion.div>
          </div>

          <section className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
              <span className="h-px w-4 bg-primary/40 block"></span>
              {t.about}
            </h4>
            <p className="text-base text-foreground leading-relaxed font-normal">
              {content?.desc}
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
              <span className="h-px w-4 bg-primary/40 block"></span>
              {t.tipsTitle}
            </h4>
            <ul className="space-y-3">
              {content?.tips.map((tip: string, idx: number) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx}
                  className="flex gap-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/5"
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm text-foreground/90 leading-tight font-medium">{tip}</p>
                </motion.li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedPlan ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            {renderGrid()}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full absolute inset-0 z-20"
          >
            {renderDetail(selectedPlan)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
