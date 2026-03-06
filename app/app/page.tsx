"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Timer, History, BarChart3, Settings, BookOpen, Info } from "lucide-react"
import { Logo } from "@/components/logo"
import { TimerView } from "@/components/timer-view"
import { HistoryView } from "@/components/history-view"
import { StatsView } from "@/components/stats-view"
import { PlanView } from "@/components/plan-view"
import { PremiumGate } from "@/components/premium-gate"
import { SettingsSheet } from "@/components/settings-sheet"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { JournalDialog } from "@/components/journal-dialog"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { getHistory, getSettings, updateHistoryRecord, updateSettings, startFast, type FastingRecord, type JournalData } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { useSubscription } from "@/lib/subscription"

type Tab = "timer" | "history" | "stats" | "plan"

export default function Home() {
  const { t, lang, setLang } = useLang()
  const { isPremium } = useSubscription()
  const [activeTab, setActiveTab] = useState<Tab>("timer")
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
      updateHistoryRecord(journalRecord.id, { journalData: data })
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
    if (isPremium) return history
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return history.filter(r => new Date(r.startTime) >= thirtyDaysAgo)
  }, [history, isPremium])

  const hasHiddenRecords = useMemo(() => {
    if (isPremium) return false
    return displayHistory.length < history.length
  }, [history, displayHistory, isPremium])

  const tabs = [
    { id: "history" as Tab, label: t.history, icon: History },
    { id: "stats" as Tab, label: t.stats, icon: Info },
    { id: "timer" as Tab, label: t.timer, icon: Timer },
    { id: "plan" as Tab, label: t.plan, icon: BookOpen },
  ]

  if (!mounted) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </main>
    )
  }

  return (
    <main className="flex h-svh flex-col bg-background mx-auto max-w-md overflow-hidden relative">
      <header className="flex items-center justify-center px-5 pt-6 pb-4 shrink-0">
        <Logo className="h-6 w-auto text-foreground" />
      </header>

      {/* Content */}
      <div className="flex-1 relative w-full">
        {activeTab === "timer" && (
          <TimerView
            onFastEnd={handleFastEnd}
            history={displayHistory}
            onNavigateToHistory={() => setActiveTab("history")}
          />
        )}
        {activeTab === "history" && (
          <HistoryView
            history={displayHistory}
            hasHiddenRecords={hasHiddenRecords}
            onHistoryChange={refreshHistory}
          />
        )}
        {activeTab === "stats" && (
          <StatsView
            history={displayHistory}
            settings={getSettings()}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        )}
        {activeTab === "plan" && <PlanView />}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md flex items-center justify-around border-t border-border bg-background/80 backdrop-blur-lg px-2 pb-[env(safe-area-inset-bottom)] pt-2 z-50">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id)
              if (id === "history" || id === "stats") refreshHistory()
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
            aria-label={label}
          >
            <Icon className="h-5 w-5" />
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
          setActiveTab("timer")
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
