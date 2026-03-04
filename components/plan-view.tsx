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

  // Simplify animation to load all at once
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

  const renderGrid = () => (
    <div className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
      <div className="mb-8 px-1">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-3 leading-tight opacity-60">
          {t.appName} &middot; {t.planTitle}
        </p>
        <h2 className="text-3xl font-black text-foreground tracking-tighter">{t.fastingPlans}</h2>
        <p className="text-sm font-medium text-muted-foreground mt-2 leading-relaxed opacity-70">
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
              className="group relative flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border border-border/50 bg-card p-6 text-center transition-all hover:border-primary/30 shadow-lg active:bg-secondary/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black shadow-xl relative z-10"
                style={{
                  backgroundColor: preset.color,
                  color: "white",
                  boxShadow: `0 8px 16px -4px ${preset.color}60`
                }}
              >
                {preset.fastHours > 0 ? preset.fastHours : "?"}
              </div>

              <div className="relative z-10">
                <p className="text-sm font-black text-foreground leading-tight tracking-tight">{content.name}</p>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-50">
                  {preset.fastHours > 0 ? `${preset.fastHours}:${preset.eatHours}` : t.customFast}
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
      <AnimatePresence initial={false} mode="popLayout">
        {!selectedPlan ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="flex flex-col h-full w-full"
          >
            {renderGrid()}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="flex flex-col h-full w-full bg-background"
          >
            {renderDetail(selectedPlan)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
