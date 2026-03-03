"use client"

import { useState, useEffect, useCallback } from "react"
import { Timer, CalendarDays, BarChart3, Settings, BookOpen } from "lucide-react"
import { TimerView } from "@/components/timer-view"
import { HistoryView } from "@/components/history-view"
import { StatsView } from "@/components/stats-view"
import { PlanView } from "@/components/plan-view"
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
  }, [])

  const refreshHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  const tabs = [
    { id: "timer" as Tab, label: t.timer, icon: Timer },
    { id: "history" as Tab, label: t.history, icon: CalendarDays },
    { id: "stats" as Tab, label: t.stats, icon: BarChart3 },
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
    <main className="flex min-h-svh flex-col bg-background mx-auto max-w-md">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="text-xl font-bold text-foreground tracking-tight">{t.appName}</h1>
          <p className="text-xs text-muted-foreground italic truncate">{t.tagline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Language toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang("bg")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "bg"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Български"
            >
              БГ
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
            aria-label={t.settings}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "timer" && <TimerView onFastEnd={refreshHistory} />}
        {activeTab === "history" && (
          <HistoryView history={history} onHistoryChange={refreshHistory} />
        )}
        {activeTab === "stats" && <StatsView history={history} />}
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
            className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === id
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
