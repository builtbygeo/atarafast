"use client"

import { useState } from "react"
import { FASTING_PRESETS, CUSTOM_PRESET, type FastingPreset } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Info, Sparkles, Settings } from "lucide-react"
import { PresetGrid } from "@/components/preset-grid"

export function PlanView() {
  const { t, lang, setLang } = useLang()
  const [selectedPlan, setSelectedPlan] = useState<FastingPreset | null>(null)
  const [selectedCard, setSelectedCard] = useState<any | null>(null)

  const allPresets = [...FASTING_PRESETS, CUSTOM_PRESET]

  // Simplify animation to load all at once
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 25 }
    },
  }

  const renderGrid = () => (
    <div className="relative flex-1 overflow-y-auto px-5 py-6 no-scrollbar pb-32">
      <div className="mb-4 px-1 flex items-start flex-col gap-4">
        <div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-4 leading-tight opacity-60">
            {t.appName} &middot; {t.planTitle}
          </p>

          <p className="text-xs font-semibold text-primary/90 leading-relaxed italic opacity-90 border-l-2 border-primary/40 pl-3 mb-6 bg-primary/5 py-2 pr-2 rounded-r-lg">
            {t.tagline}
          </p>

          <h2 className="text-3xl font-black text-foreground tracking-tighter">{t.fastingPlans}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2 leading-relaxed opacity-70">
            {t.plansSubtitle}
          </p>
        </div>

      </div>

      <div className="mt-2">
        <PresetGrid onSelect={(preset) => setSelectedPlan(preset)} showHeader={false} />
      </div>

      {/* Educational Section */}
      <div className="mt-12 mb-6 px-1">
        <h2 className="text-2xl font-black text-foreground tracking-tighter">{t.learnMore}</h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {/* Educational Cards */}
        {(t.educationalCards as any[])?.map((card) => (
          <motion.button
            key={card.id}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(card)}
            className="w-full group relative flex flex-col items-start gap-3 rounded-[1.5rem] border border-white/5 bg-secondary/20 p-5 text-left transition-all hover:bg-secondary/30 active:scale-[0.99] overflow-hidden"
          >
            {/* Subtle Accent Glow */}
            <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex w-full items-start justify-between gap-4 relative z-10">
              <h4 className="text-sm font-black text-foreground tracking-tight leading-snug flex-1">
                {card.title}
              </h4>
              <div className="h-8 w-8 rounded-xl bg-background/50 border border-white/5 flex items-center justify-center shrink-0">
                <Info className="h-4 w-4 text-primary/60" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed opacity-70 relative z-10">
              {card.short}
            </p>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 p-6 rounded-[2rem] bg-secondary/5 border border-border/40 backdrop-blur-sm shadow-sm"
      >
        <div className="flex gap-4">
          <Info className="h-5 w-5 text-primary/40 shrink-0 mt-0.5" />
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
        <header className="px-5 py-6 border-b border-border/50 flex items-center gap-4 bg-background/90 backdrop-blur-xl sticky top-0 z-10">
          <button
            onClick={() => setSelectedPlan(null)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h3 className="font-black text-xl text-foreground tracking-tight leading-none">{content?.name}</h3>
            <span className="text-[10px] items-center gap-1.5 flex uppercase tracking-wider text-muted-foreground mt-2 font-black opacity-60">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {preset.fastHours > 0 ? `${preset.fastHours}h Fast \u2022 ${preset.eatHours}h Eat` : "Personal window"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 no-scrollbar pb-32">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-32 w-32 rounded-[3rem] flex items-center justify-center text-5xl font-black shadow-2xl relative"
              style={{
                backgroundColor: preset.color,
                color: "white",
                boxShadow: `0 20px 40px -12px ${preset.color}70`
              }}
            >
              <Sparkles className="absolute -top-3 -right-3 h-10 w-10 text-primary drop-shadow-lg" />
              {preset.fastHours > 0 ? preset.fastHours : "?"}
            </motion.div>
          </div>

          <section className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
              <span className="h-px w-6 bg-primary/20 block"></span>
              {t.about}
            </h4>
            <p className="text-base text-foreground/90 leading-relaxed font-medium">
              {content?.desc}
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
              <span className="h-px w-6 bg-primary/20 block"></span>
              {t.tipsTitle}
            </h4>
            <ul className="space-y-3">
              {content?.tips.map((tip: string, idx: number) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx}
                  className="flex gap-4 p-5 rounded-[2rem] bg-secondary/10 border border-secondary/5 shadow-sm"
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed font-bold">{tip}</p>
                </motion.li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    )
  }

  const renderCardDetail = (card: any) => {
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        <header className="px-5 py-6 border-b border-border/50 flex items-center gap-4 bg-background/90 backdrop-blur-xl sticky top-0 z-10">
          <button
            onClick={() => setSelectedCard(null)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h3 className="font-black text-xl text-foreground tracking-tight leading-tight flex-1 line-clamp-1">{card.title}</h3>
            <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">{t.fastingBasics}</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar pb-32">
          <div className="bg-secondary/10 p-5 sm:p-6 rounded-[2.5rem] mb-8 border border-border/50 shadow-sm flex items-start gap-4">
            <Info className="h-6 w-6 sm:h-8 sm:w-8 text-primary/40 shrink-0 mt-0.5" />
            <p className="text-base text-foreground font-black leading-snug">{card.short}</p>
          </div>

          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                {card.full}
              </p>
            </div>

            <button
              onClick={() => setSelectedCard(null)}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {t.understood}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative flex flex-col h-full overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        {selectedPlan ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 z-20 will-change-transform"
          >
            {renderDetail(selectedPlan)}
          </motion.div>
        ) : selectedCard ? (
          <motion.div
            key="card-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 z-20 will-change-transform"
          >
            {renderCardDetail(selectedCard)}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col h-full w-full will-change-[opacity]"
          >
            {renderGrid()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
