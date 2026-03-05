"use client"

import { useMemo, useState } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subWeeks,
  differenceInDays,
} from "date-fns"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Rectangle, Cell } from "recharts"
import { Flame, Target, Clock, TrendingUp, Lock, Sparkles, Settings } from "lucide-react"
import type { FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { useSubscription, startCheckout } from "@/lib/subscription"
import { getAiUsage, checkAiQuota, incrementAiUsage } from "@/lib/storage"

interface StatsViewProps {
  history: FastingRecord[]
  onOpenSettings?: () => void
  onOpenUpgrade?: () => void
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const { t } = useLang()
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-black text-foreground">
          {payload[0].value} <span className="text-[10px] text-muted-foreground">{t.hours}</span>
        </p>
      </div>
    )
  }
  return null
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function StatsView({ history, onOpenSettings, onOpenUpgrade }: StatsViewProps) {
  const { t, lang, setLang } = useLang()
  const { isPremium } = useSubscription()
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const quota = checkAiQuota(isPremium)

  // Simple markdown-style formatter
  const formatAiText = (text: string) => {
    if (!text) return null
    return text.split('\n').filter(line => line.trim() !== '').map((line, i) => {
      // Handle bold text with **
      const parts = line.split(/\*\*([^*]+)\*\*/)
      return (
        <div key={i} className={line.trim().startsWith('-') ? "mb-5 pl-5 -indent-5" : "mb-4"}>
          {parts.map((part, j) => (
            j % 2 === 1 ? <strong key={j} className="text-primary font-black uppercase tracking-tight">{part}</strong> : part
          ))}
        </div>
      )
    })
  }

  const handleAnalyze = async () => {
    if (!quota.canUse) return

    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, stats, lang })
      })
      const data = await res.json()
      if (data.analysis) {
        setAiAnalysis(data.analysis)
        incrementAiUsage()
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const stats = useMemo(() => {
    if (history.length === 0) {
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
    history.forEach((r) => {
      if (r.endTime) {
        totalMs += new Date(r.endTime).getTime() - new Date(r.startTime).getTime()
      }
      if (r.completed) completedCount++
    })

    const totalHours = Math.round(totalMs / (1000 * 60 * 60))
    const avgMs = totalMs / history.length
    const avgHours = Math.round(avgMs / (1000 * 60 * 60) * 10) / 10

    // Streak calculation: consecutive days with a completed fast
    const fastDates = [...new Set(
      history
        .filter((r) => r.completed)
        .map((r) => format(new Date(r.startTime), "yyyy-MM-dd"))
    )].sort()

    let currentStreak = 0
    let longestStreak = 0
    let streak = 0
    const today = format(new Date(), "yyyy-MM-dd")

    for (let i = fastDates.length - 1; i >= 0; i--) {
      const date = new Date(fastDates[i])
      const prevDate = i > 0 ? new Date(fastDates[i - 1]) : null

      if (i === fastDates.length - 1) {
        const daysDiff = differenceInDays(new Date(today), date)
        if (daysDiff <= 1) {
          streak = 1
          currentStreak = 1
        } else {
          streak = 0
        }
      }

      if (prevDate) {
        const daysDiff = differenceInDays(date, prevDate)
        if (daysDiff === 1) {
          streak++
          if (i === fastDates.length - 1 || currentStreak > 0) currentStreak = streak
        } else {
          longestStreak = Math.max(longestStreak, streak)
          streak = 1
          if (currentStreak === 0) currentStreak = 0
        }
      }
    }
    longestStreak = Math.max(longestStreak, streak)
    if (currentStreak === 0 && longestStreak > 0) currentStreak = 0

    return {
      totalFasts: history.length,
      totalHours,
      avgDuration: avgHours,
      currentStreak,
      longestStreak,
      completionRate: Math.round((completedCount / history.length) * 100),
    }
  }, [history])

  // Weekly chart data (last 8 weeks)
  const weeklyData = useMemo(() => {
    const weeks = []
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const weekStartDate = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 })
      const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 })
      const days = eachDayOfInterval({ start: weekStartDate, end: weekEndDate })

      let weekHours = 0
      history.forEach((r) => {
        if (!r.endTime) return
        const rStart = new Date(r.startTime)
        if (days.some(day => isSameDay(rStart, day))) {
          weekHours += (new Date(r.endTime).getTime() - rStart.getTime()) / (1000 * 60 * 60)
        }
      })

      const hours = Math.round(weekHours * 10) / 10

      let color = "var(--primary)"
      if (hours < 56) color = "oklch(0.6 0.2 30)"
      else if (hours < 84) color = "oklch(0.7 0.18 55)"
      else if (hours < 112) color = "var(--primary)"
      else color = "oklch(0.85 0.22 85)"

      weeks.push({
        label: format(weekStartDate, "MMM d"),
        hours,
        color
      })
    }
    return weeks
  }, [history])

  return (
    <div className="relative flex-1 overflow-y-auto px-5 py-6">
      <div className="absolute top-6 right-5 flex gap-2 z-10">
        <div className="flex rounded-full bg-secondary/40 p-1 border border-border/50 text-[10px] font-black tracking-widest">
          <button
            onClick={() => setLang("bg")}
            className={`px-3 py-1.5 rounded-full transition-colors ${lang === "bg" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            БГ
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded-full transition-colors ${lang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            EN
          </button>
        </div>
        <button
          onClick={onOpenSettings}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60 border border-border/50 mt-0.5"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-1 mt-2">{t.statsTitle}</h2>
      <p className="text-sm text-muted-foreground mb-6 pr-20">{t.statsSubtitle}</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard icon={Target} label={t.totalFasts} value={stats.totalFasts} />
        <StatCard icon={Clock} label={t.totalHours} value={stats.totalHours} sub={t.hoursFastedLabel} />
      </div>

      <div className="relative">
        {/* If not premium, add a blur overlay over advanced stats */}
        {!isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md rounded-2xl border border-border mt-[-10px] pb-4">
            <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-2xl flex flex-col items-center text-center max-w-[280px]">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">Unlock Advanced Stats</h3>
              <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed">
                Get full access to your metabolic trends, streaks, and completion rates with Atara+.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-2 gap-3 mb-8 ${!isPremium ? "opacity-30 pointer-events-none" : ""}`}>
          <StatCard icon={Flame} label={t.currentStreak} value={stats.currentStreak} sub={t.days} />
          <StatCard icon={TrendingUp} label={t.longestStreak} value={stats.longestStreak} sub={t.days} />
        </div>

        <div className={`grid grid-cols-2 gap-3 mb-8 ${!isPremium ? "opacity-20 pointer-events-none" : ""}`}>
          <StatCard icon={Clock} label={t.avgDuration} value={`${stats.avgDuration}h`} />
          <StatCard icon={Target} label={t.completionRate} value={`${stats.completionRate}%`} sub={t.hitTarget} />
        </div>

        {/* AI Analysis Section */}
        {isPremium && (
          <div className="rounded-[2rem] border border-primary/30 bg-primary/5 p-6 mb-8 mt-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>
            <h3 className="text-xl font-black tracking-tighter text-foreground mb-4 flex items-center gap-3">
              <span className="h-10 w-10 flex items-center justify-center bg-primary/20 rounded-xl text-primary border border-primary/20">
                <Sparkles className="h-5 w-5" />
              </span>
              Atara AI Coach
            </h3>

            {aiAnalysis ? (
              <div className="text-sm text-foreground/90 leading-relaxed relative z-10 font-medium">
                {formatAiText(aiAnalysis)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || history.length === 0 || !quota.canUse}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 relative z-10 uppercase tracking-widest mt-2"
                >
                  {isAnalyzing ? "Analyzing metabolism..." : "Generate AI Insights"}
                </button>

                {!quota.canUse && history.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-xl flex items-start gap-2 relative z-10">
                    <Lock className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-destructive leading-tight mb-1">{quota.reason}</p>
                      <button
                        onClick={onOpenUpgrade}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Upgrade for more access →
                      </button>
                    </div>
                  </div>
                )}

                {quota.canUse && (
                  <p className="text-[10px] text-muted-foreground text-center font-bold tracking-widest opacity-60 uppercase">
                    {isPremium
                      ? `${quota.remaining} Weekly Credits Left`
                      : "1 Monthly Credit Remaining"}
                  </p>
                )}
              </div>
            )}
            {history.length === 0 && !aiAnalysis && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-3 text-center opacity-70">Complete your first fast to use AI</p>
            )}
          </div>
        )}

        {/* Weekly chart */}
        <div className={`rounded-xl border border-border bg-card p-4 ${!isPremium ? "opacity-10 pointer-events-none" : ""}`}>
          <h3 className="text-sm font-semibold text-foreground mb-4">{t.weeklyFastingHours}</h3>
          {history.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Complete your first fast to see trends</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="hours"
                  radius={[6, 6, 6, 6]}
                  barSize={32}
                  className="transition-all"
                >
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
