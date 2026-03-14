"use client"

import { useMemo, useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subWeeks,
  differenceInDays,
  subDays,
  startOfDay,
} from "date-fns"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { WeightTrendsChart } from "./weight-trends-chart"
import { transformWeightData } from "@/lib/stats"
import { ChevronRight, Lock, Sparkles, Settings, Flame, Trophy, Zap } from "lucide-react"
import { PremiumGate } from "./premium-gate"
import type { FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { useSubscription, startCheckout } from "@/lib/subscription"
import { getAiUsage, checkAiQuota, incrementAiUsage, saveAiReport } from "@/lib/storage"
import type { AppSettings } from "@/lib/storage"
import { calculateStreaks } from "@/lib/stats"

const safeFormat = (date: Date | number | string, formatStr: string, fallback: string = "") => {
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return fallback
    return format(d, formatStr)
  } catch {
    return fallback
  }
}

interface StatsViewProps {
  history: FastingRecord[]
  settings: AppSettings
  onOpenSettings?: () => void
  onOpenUpgrade?: () => void
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const { t } = useLang()
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 p-2.5 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-black text-foreground">
          {payload[0].value} <span className="text-[10px] text-muted-foreground">{t?.hours || "h"}</span>
        </p>
      </div>
    )
  }
  return null
}

export function StatsView({ history, settings, onOpenSettings, onOpenUpgrade }: StatsViewProps) {
  const { t, lang, setLang } = useLang()
  const { isPremium } = useSubscription()
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { user, isLoaded: isUserLoaded } = useUser()

  const displayHistory = useMemo(() => {
    if (isPremium) return history
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return history.filter(r => new Date(r.startTime) >= thirtyDaysAgo)
  }, [history, isPremium])

  // Load last report from localStorage (and fallback to clerk metadata)
  useEffect(() => {
    // 1. Try local storage first for speed
    const localUsage = getAiUsage()
    if (localUsage?.lastAiReport) {
      setAiAnalysis(localUsage.lastAiReport)
    } else if (isUserLoaded && user?.publicMetadata?.lastAiReport) {
      // 2. Fallback to clerk metadata if local empty (e.g., cleared cache)
      setAiAnalysis(user.publicMetadata.lastAiReport as string)
    }
  }, [isUserLoaded, user])


  // Simple markdown-style formatter
  const formatAiText = (text: string) => {
    if (!text) return null
    return text.split('\n').filter(line => line.trim() !== '').map((line, i) => {
      // Handle bold text with **
      const parts = line.split(/\*\*([^*]+)\*\*/)
      return (
        <div key={i} className={line.trim().startsWith('-') ? "mb-5 pl-5 -indent-5" : "mb-4"}>
          {parts.map((part, j) => (
            j % 2 === 1 ? <strong key={j} className="text-primary font-bold tracking-tight">{part}</strong> : part
          ))}
        </div>
      )
    })
  }

  // 1. STATS CALCULATION (Moved up to avoid TDZ)
  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        totalFasts: 0,
        totalHours: 0,
        avgDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      }
    }

    // Filter out records with invalid dates to prevent crashes
    const validHistory = history.filter(r => r && r.startTime && !isNaN(new Date(r.startTime).getTime()))

    if (validHistory.length === 0) {
      return {
        totalFasts: 0,
        totalHours: 0,
        avgDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      }
    }

    let totalMs = 0
    let completedCount = 0
    validHistory.forEach((r) => {
      const start = new Date(r.startTime).getTime()
      const end = r.endTime ? new Date(r.endTime).getTime() : null

      if (end && !isNaN(end)) {
        totalMs += end - start
      }
      if (r.completed) completedCount++
    })

    const totalHours = Math.round(totalMs / (1000 * 60 * 60))
    const avgMs = totalMs / validHistory.length
    const avgHours = Math.round(avgMs / (1000 * 60 * 60) * 10) / 10

    // Use the robust calculateStreaks utility
    const streakStats = calculateStreaks(validHistory)

    return {
      totalFasts: validHistory.length,
      totalHours,
      avgDuration: avgHours,
      currentStreak: streakStats.currentStreak,
      longestStreak: streakStats.longestStreak,
      completionRate: Math.round((completedCount / validHistory.length) * 100),
    }
  }, [history])

  const quota = checkAiQuota(isPremium)

  const handleAnalyze = async () => {
    if (!quota.canUse || stats.totalFasts < 5) return

    setIsAnalyzing(true)
    try {
      // Extract journal entries for analysis
      const journals = history
        .filter(r => r.journalData)
        .map(r => ({
          date: r.startTime,
          ...r.journalData
        }))

      const userPrompt = `Here is my fasting history (last 20): ${JSON.stringify(history.slice(0, 20))}
    And my current weekly stats: ${JSON.stringify(stats)}
    And my latest journal reflections: ${JSON.stringify(journals)}`

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt,
          lang
        })
      })
      const data = await res.json()
      if (data.analysis) {
        setAiAnalysis(data.analysis)
        incrementAiUsage()
        saveAiReport(data.analysis)

        // Persist to clerk metadata as backup
        fetch("/api/ai/save-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ report: data.analysis })
        }).catch(err => console.error("Failed to persist AI report:", err))
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Weekly chart data (Rolling 7 days)
  const weeklyData = useMemo(() => {
    const daysData = []
    const now = new Date()

    const dayLabelsGlobal = [
      t?.sun || "S",
      t?.mon || "M",
      t?.tue || "T",
      t?.wed || "W",
      t?.thu || "T",
      t?.fri || "F",
      t?.sat || "S"
    ]

    let totalRollingHours = 0
    let daysWithFasts = 0

    for (let i = 0; i < 7; i++) {
      const currentDate = subDays(now, 6 - i)

      let dayHours = 0
      const dayStart = startOfDay(currentDate).getTime()

      history.forEach((r: FastingRecord) => {
        if (!r || !r.startTime || !r.endTime) return
        const rStart = new Date(r.startTime).getTime()
        const rEnd = new Date(r.endTime).getTime()

        if (isNaN(rStart) || isNaN(rEnd)) return

        // Only count if it ended on this day
        if (isSameDay(new Date(rEnd), new Date(dayStart))) {
          dayHours += (rEnd - rStart) / (1000 * 60 * 60)
        }
      })

      const hours = Math.round(dayHours * 10) / 10
      if (hours > 0) {
        totalRollingHours += hours
        daysWithFasts++
      }

      daysData.push({
        label: dayLabelsGlobal[new Date(dayStart).getDay()],
        hours,
      })
    }

    const weeklyAvg = daysWithFasts > 0 ? Math.round((totalRollingHours / daysWithFasts) * 10) / 10 : 0

    return { daysData, weeklyAvg }
  }, [history, t])

  const circumference = 2 * Math.PI * 110
  const streakPct = Math.min(100, (stats.currentStreak / Math.max(1, stats.longestStreak)) * 100) || 50
  const strokeDashoffset = circumference - (streakPct / 100) * circumference

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 sm:px-5 py-6 no-scrollbar pb-44 [touch-action:pan-y]">
      <header className="flex items-start justify-between mb-8 mt-2 px-1 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter leading-none mb-1">{t?.statsTitle || "Dashboard"}</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{safeFormat(new Date(), "EEE, MMM d")}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-full bg-secondary/40 p-1 border border-border/50 text-[10px] font-black tracking-widest shadow-sm backdrop-blur-md">
            <button
              onClick={() => setLang("bg")}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === "bg" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              БГ
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={onOpenSettings}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-secondary/40 text-muted-foreground transition-all hover:text-foreground hover:bg-secondary/60 border border-border/50 mt-0.5 shadow-sm backdrop-blur-md"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 1. Glowing Streak Circle - ALWAYS VISIBLE */}
      <div className="relative flex justify-center py-4 mb-4">
        <div className="relative flex items-center justify-center w-64 h-64">
          <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90 overflow-visible">
            {/* Background ring */}
            <circle cx="128" cy="128" r="110" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />

            {/* Indicator Ring with layered strokes for performant glow */}
            <circle
              cx="128" cy="128" r="110"
              stroke="oklch(var(--primary))"
              strokeWidth="14"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeOpacity="0.15"
              style={{ filter: 'blur(8px)' }}
            />

            <circle cx="128" cy="128" r="110" stroke="oklch(var(--primary))" strokeWidth="6" fill="none"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center inset-0">
            <div className={`mt-4 p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)] mb-2 ${stats.currentStreak > 0 ? "animate-pulse" : "opacity-30"}`}>
              <Flame className={`h-6 w-6 ${stats.currentStreak > 0 ? "text-primary fill-primary/20" : "text-muted-foreground"}`} />
            </div>
            <div className="text-6xl font-black text-foreground tracking-tighter mb-0 tabular-nums leading-none flex items-baseline">
              {stats.currentStreak}
            </div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-foreground font-black mb-1 mt-1 z-10">{t?.days || "DAYS"}</div>
            <div className="text-[11px] font-bold text-foreground/80 lowercase mt-1 tracking-wide">{t?.currentStreak || "Current Streak"}</div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* 2. Weekly Activity Chart (Glowing Area) */}
        <div className="mb-4">
          <WeightTrendsChart data={transformWeightData(history)} />
        </div>

        {!isPremium && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-[2rem] border border-white/5 mt-[-10px] pb-4">
            <div className="bg-card/90 backdrop-blur-2xl border border-border/50 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-[280px]">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 text-primary shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-primary/20">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black tracking-tighter mb-2">Unlock Dashboard</h3>
              <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed">
                Get full access to detailed metabolic trends and daily AI performance coaching with Atara Pro.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-black tracking-wide text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-all outline-none"
              >
                <Sparkles className="w-4 h-4" />
                UPGRADE NOW
              </button>
            </div>
          </div>
        )}

        <div className={`rounded-3xl border border-white/5 bg-secondary/30 p-5 shadow-sm mb-4 transition-opacity ${!isPremium ? "opacity-30 pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[17px] font-bold text-foreground tracking-tight mb-1">{t?.weeklyActivity || "Weekly Activity"}</h3>
              <p className="text-[13px] font-medium text-muted-foreground">
                {t?.activeTime || "Active Time"}: <span className="text-foreground/90">{weeklyData.weeklyAvg} {t?.hours || "h"} ({t?.dailyAvg || "avg"})</span>
              </p>
            </div>
          </div>

          <div className="h-44 pr-2 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData.daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="currentColor" className="opacity-[0.06]" />
                395:                 <XAxis dataKey="label" tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} tickMargin={12} className="opacity-50" />
                396:                 <YAxis tickCount={5} tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} tickMargin={12} className="opacity-50" />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "currentColor", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.1 }} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#4ADE80"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  dot={{ r: 4, fill: "#fff", stroke: "#4ADE80", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#fff", stroke: "#4ADE80", strokeWidth: 2, className: "drop-shadow-[0_0_8px_rgba(74,222,128,1)]" }}
                  className="drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Weekly Stats Counters */}
        <div className={`rounded-[2rem] border border-border/80 bg-secondary/20 p-5 shadow-sm backdrop-blur-sm mb-6 transition-opacity ${!isPremium ? "opacity-30 pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-sm font-black text-foreground tracking-tight">{t?.weeklyStats || "Weekly Stats"}</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 divide-x divide-border/50 px-1">
            <div className="flex justify-center flex-col">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t?.totalHours || "Total Hours"}</span>
              <span className="text-xl sm:text-2xl font-black text-foreground mb-1 tabular-nums tracking-tighter leading-none">{stats.totalHours}<span className="text-sm">h</span></span>
              <span className="text-[8px] font-bold text-primary flex items-center gap-0.5 tracking-wide">▲ +12%</span>
            </div>
            <div className="flex justify-center flex-col pl-4">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t?.completionRate || "Avg Focus"}</span>
              <span className="text-xl sm:text-2xl font-black text-foreground mb-1 tabular-nums tracking-tighter leading-none">{stats.completionRate}<span className="text-sm">%</span></span>
              <span className="text-[8px] font-bold text-primary flex items-center gap-0.5 tracking-wide">▲ +5%</span>
            </div>
            <div className="flex justify-center flex-col pl-4">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t?.longestStreak || "Peak Perf."}</span>
              <span className="text-xl sm:text-2xl font-black text-foreground mb-1 tabular-nums tracking-tighter leading-none">{stats.longestStreak}<span className="text-sm">d</span></span>
              <span className="text-[8px] font-bold text-transparent select-none flex items-center gap-0.5 tracking-wide">▲</span>
            </div>
          </div>
        </div>

        {/* 4. AI Coach Dashboard Card */}
        {isPremium && (
          <div className="rounded-[2.5rem] border border-primary/20 bg-card p-6 mb-8 relative overflow-hidden group shadow-[0_8px_40px_-12px_rgba(34,197,94,0.15)] transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-30 blur-[40px] group-hover:opacity-50 transition-opacity duration-1000">
              <Sparkles className="w-40 h-40 text-primary" />
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground mb-1">AI Coach</h3>
                <p className="text-[11px] font-bold text-primary/80">
                  {isUserLoaded && user?.firstName ? `Hi ${user.firstName}!` : "Ready to optimize?"}
                </p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-xl text-primary border border-primary/20 flex-shrink-0 relative">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-sm"></div>
                <span className="text-lg font-black italic relative z-10">A</span>
              </div>
            </div>

            <div className="relative z-10 min-h-[60px]">
              {stats.totalFasts < 5 ? (
              <PremiumGate requirements={{ minFasts: 5 }} reason="5 fasts needed to unlock AI Coach">
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Lock className="h-4 w-4 text-primary/40" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-primary/80 mb-2">{t?.aiCoachLocked}</h4>
                  <p className="text-[12px] text-muted-foreground font-medium max-w-[200px] leading-relaxed">
                    {t?.aiCoachRequired}
                  </p>
                </div>
              </PremiumGate>
            ) : aiAnalysis ? (
                <div className="flex flex-col gap-6">
                  <div className="text-[13px] text-foreground/80 leading-relaxed font-medium">
                    {formatAiText(aiAnalysis)}
                  </div>
                  {quota.canUse && (
                    <div className="h-px w-full bg-primary/10 my-1" />
                  )}
                </div>
              ) : (
                <div className="text-[13px] text-foreground/80 leading-relaxed font-medium mb-6 max-w-[90%]">
                  Based on your activity, let's optimize your focus.<br /><br />
                  Ready for a new challenge? Generate your latest insights below.
                </div>
              )}
            </div>

            {settings?.journalEnabled && stats.totalFasts >= 5 && (
              <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-4 flex items-center gap-1.5 relative z-10">
                <Sparkles className="w-2.5 h-2.5" />
                {t?.aiCoachJournalNote}
              </p>
            )}

            {stats.totalFasts >= 5 && quota.canUse && (
              <div className="flex flex-col items-center gap-3 relative z-10 w-full mb-4">
                {!aiAnalysis && (
                  <div className="text-[13px] text-foreground/80 leading-relaxed font-medium mb-2 self-start text-left">
                    Ready to optimize further? Generate your daily performance insights.
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all outline-none disabled:opacity-50 whitespace-nowrap"
                >
                  {isAnalyzing ? "Analyzing..." : "Generate Insights"}
                </button>
              </div>
            )}

            {!quota.canUse && (
              <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase tracking-widest">
                  <Lock className="h-3 w-3" />
                  {t?.limitReached}
                </div>
                <span className="text-[10px] text-muted-foreground">{t?.tryAgainTomorrow}</span>
              </div>
            )}
            {quota.canUse && (
              <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase mt-4 text-center opacity-60 relative z-10">
                {isPremium
                  ? (t?.dailyCreditAvailable || "Daily Credit Available")
                  : t?.monthlyCreditRemaining?.replace("{{count}}", quota.remaining?.toString() || "0") || "1 Monthly Credit Remaining"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
