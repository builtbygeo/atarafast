"use client"

import { useMemo } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subWeeks,
  differenceInDays,
} from "date-fns"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Rectangle } from "recharts"
import { Flame, Target, Clock, TrendingUp } from "lucide-react"
import type { FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"

interface StatsViewProps {
  history: FastingRecord[]
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

export function StatsView({ history }: StatsViewProps) {
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

      weeks.push({
        label: format(weekStartDate, "MMM d"),
        hours: Math.round(weekHours * 10) / 10,
      })
    }
    return weeks
  }, [history])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <h2 className="text-lg font-semibold text-foreground mb-1">Stats</h2>
      <p className="text-sm text-muted-foreground mb-6">Your fasting overview</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard icon={Target} label="Total fasts" value={stats.totalFasts} />
        <StatCard icon={Clock} label="Total hours" value={stats.totalHours} sub="hours fasted" />
        <StatCard icon={Flame} label="Current streak" value={stats.currentStreak} sub="days" />
        <StatCard icon={TrendingUp} label="Longest streak" value={stats.longestStreak} sub="days" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard icon={Clock} label="Avg. duration" value={`${stats.avgDuration}h`} />
        <StatCard icon={Target} label="Completion" value={`${stats.completionRate}%`} sub="hit target" />
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Weekly fasting hours</h3>
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
                fill="oklch(var(--primary))"
                radius={[6, 6, 6, 6]}
                barSize={32}
                activeBar={<Rectangle stroke="oklch(var(--primary))" strokeWidth={1} fill="oklch(var(--primary)/0.9)" />}
                className="transition-all"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
