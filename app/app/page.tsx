"use client"

import { useState, useEffect, useCallback } from "react"
import { Timer, CalendarDays, BarChart3, Settings, BookOpen } from "lucide-react"
import { Logo } from "@/components/logo"
import { TimerView } from "@/components/timer-view"
import { HistoryView } from "@/components/history-view"
import { StatsView } from "@/components/stats-view"
import { PlanView } from "@/components/plan-view"
import { PremiumGate } from "@/components/premium-gate"
import { SettingsSheet } from "@/components/settings-sheet"
import { getHistory, type FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"

type Tab = "timer" | "history" | "stats" | "plan"

export default function Home() {
  const { t, lang, setLang } = useLang()
  const [activeTab, setActiveTab] = useState<Tab>("timer")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [history, setHistory] = useState<FastingRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHistory(getHistory())

    // Register Service Worker for Notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }
  }, [])

  const refreshHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  const tabs = [
    { id: "history" as Tab, label: t.history, icon: CalendarDays },
    { id: "stats" as Tab, label: t.stats, icon: BarChart3 },
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
    <main className="flex min-h-svh flex-col bg-background mx-auto max-w-md px-2">
      <header className="flex items-center justify-center px-5 pt-6 pb-4">
        <Logo className="h-6 w-auto text-foreground" />
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === "timer" && (
          <TimerView
            onFastEnd={refreshHistory}
            history={history}
            onNavigateToHistory={() => setActiveTab("history")}
          />
        )}
        {activeTab === "history" && (
          <HistoryView history={history} onHistoryChange={refreshHistory} />
        )}
        {activeTab === "stats" && (
          <PremiumGate featureName="Statistics" blur>
            <StatsView history={history} onOpenSettings={() => setSettingsOpen(true)} />
          </PremiumGate>
        )}
        {activeTab === "plan" && <PlanView />}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="sticky bottom-0 flex items-center justify-around border-t border-border bg-background/80 backdrop-blur-lg px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id)
              if (id === "history" || id === "stats") refreshHistory()
            }}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors ${activeTab === id
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
        onDataCleared={() => {
          setHistory([])
          setActiveTab("timer")
        }}
      />
    </main>
  )
}
