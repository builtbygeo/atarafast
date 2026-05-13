"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Timer, History, BarChart3, Settings } from "lucide-react"
import { Logo } from "@/components/logo"
import { TimerView } from "@/components/timer-view"
import { HistoryView } from "@/components/history-view"
import { StatsView } from "@/components/stats-view"
import { PremiumGate } from "@/components/premium-gate"
import { SettingsSheet } from "@/components/settings-sheet"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { JournalDialog } from "@/components/journal-dialog"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { getHistory, getSettings, updateHistoryRecord, updateSettings, startFast, type FastingRecord, type JournalData } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { useSubscription } from "@/lib/subscription"
import { ENABLE_PREMIUM } from "@/lib/features"
import { cn } from "@/lib/utils"

type Tab = "today" | "log" | "progress"

export default function Home() {
  const { t, lang, setLang } = useLang()
  const { isPremium } = useSubscription()
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "today"
    const stored = localStorage.getItem("atara-active-tab")
    if (stored === "today" || stored === "log" || stored === "progress") return stored
    return "today"
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [history, setHistory] = useState<FastingRecord[]>([])
  const [mounted, setMounted] = useState(false)
  const [journalRecord, setJournalRecord] = useState<FastingRecord | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    setMounted(true)
    const settings = getSettings()
    if (!settings.hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
    const rawHistory = getHistory()
    setHistory(rawHistory)

    // Register Service Worker for Notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("atara-active-tab", activeTab)
  }, [activeTab])

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  const refreshHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  const handleFastEnd = useCallback((record: FastingRecord) => {
    refreshHistory()
    if (getSettings().journalEnabled) {
      setJournalRecord(record)
    }
  }, [refreshHistory])

  const handleSaveJournal = useCallback((data: JournalData) => {
    if (journalRecord) {
      updateHistoryRecord(journalRecord.id, { journalData: data, weight: data.weight })
      refreshHistory()
    }
    setJournalRecord(null)
  }, [journalRecord, refreshHistory])

  const handleOnboardingComplete = useCallback((recommendedPlanId: string, startImmediately: boolean) => {
    updateSettings({
      hasCompletedOnboarding: true,
      onboardingRecommendation: recommendedPlanId
    })

    if (startImmediately) {
      const preset = getPresetById(recommendedPlanId)
      if (preset) {
        startFast(preset.id, preset.fastHours)
      }
    }

    setShowOnboarding(false)
    // Force a re-render/refresh of the timer view state if needed
    // The easiest way is to refresh history or just let it naturally happen
    refreshHistory()
  }, [refreshHistory])

  const displayHistory = useMemo(() => {
    if (!ENABLE_PREMIUM) return history
    if (isPremium) return history
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return history.filter(r => new Date(r.startTime) >= thirtyDaysAgo)
  }, [history, isPremium])

  const hasHiddenRecords = useMemo(() => {
    if (!ENABLE_PREMIUM) return false
    if (isPremium) return false
    return displayHistory.length < history.length
  }, [history, displayHistory, isPremium])

  const tabs = [
    { id: "today" as Tab, label: t.today, icon: Timer },
    { id: "log" as Tab, label: t.history, icon: History },
    { id: "progress" as Tab, label: t.progress, icon: BarChart3 },
  ]

  if (!mounted) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </main>
    )
  }

  return (
    <main className="flex h-dvh flex-col bg-background mx-auto max-w-md overflow-hidden relative overscroll-none">
      <header className="flex items-center justify-center px-5 pt-6 pb-4 shrink-0">
        <Logo className="h-6 w-auto text-foreground" />
      </header>

      {/* Content area — all three views mounted simultaneously, CSS-toggled */}
      <div className="flex-1 relative w-full overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-150",
          activeTab === "today" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        )}>
          <TimerView
            onFastEnd={handleFastEnd}
            history={displayHistory}
            onNavigateToHistory={() => setActiveTab("log")}
          />
        </div>
        <div className={cn(
          "absolute inset-0 transition-opacity duration-150",
          activeTab === "log" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        )}>
          <HistoryView
            history={displayHistory}
            hasHiddenRecords={hasHiddenRecords}
            onHistoryChange={refreshHistory}
          />
        </div>
        <div className={cn(
          "absolute inset-0 transition-opacity duration-150",
          activeTab === "progress" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        )}>
          <StatsView
            history={displayHistory}
            settings={getSettings()}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-xl px-2 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id)
            }}
          className={cn(
            "relative flex flex-col items-center gap-1 py-1.5 min-w-[64px] min-h-[48px]",
            "text-[11px] font-semibold tracking-wide transition-all duration-200",
            "active:scale-95",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-2xl",
            activeTab === id
              ? "text-primary"
              : "text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.03]"
          )}
            aria-label={label}
            aria-current={activeTab === id ? "page" : undefined}
          >
            {activeTab === id && (
              <motion.div
                layoutId={prefersReducedMotion ? undefined : "tab-indicator"}
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Settings Sheet */}
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        onDataCleared={() => {
          setHistory([])
          setActiveTab("today")
        }}
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />

      {/* Journal Dialog */}
      {journalRecord && (
        <JournalDialog
          initialData={journalRecord.journalData}
          onSave={handleSaveJournal}
          onSkip={() => setJournalRecord(null)}
        />
      )}

      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
    </main>
  )
}
