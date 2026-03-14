"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { format, subDays, startOfDay, isSameDay } from "date-fns"
import { type FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { Plus, ChevronRight } from "lucide-react"

interface RecentFastsChartProps {
    history: FastingRecord[]
    activeFast?: FastingRecord | null
    onAddClick?: () => void
    onSeeMoreClick?: () => void
}

export function RecentFastsChart({ history, activeFast, onAddClick, onSeeMoreClick }: RecentFastsChartProps) {
    const { t } = useLang()

    const last7DaysData = useMemo(() => {
        const days = []
        const now = new Date()

        // Create last 7 calendar days: oldest (left) -> newest/Today (right)
        for (let i = 6; i >= 0; i--) {
            const date = subDays(now, i)
            const isToday = i === 0

            // Find history records that ended on this day
            const dayFasts = history.filter(f => {
                if (!f.endTime) return false
                return isSameDay(new Date(f.endTime), date)
            })

            let totalHours = 0
            let maxTarget = 0

            dayFasts.forEach(f => {
                if (f.endTime) {
                    const ms = new Date(f.endTime).getTime() - new Date(f.startTime).getTime()
                    totalHours += ms / (1000 * 60 * 60)
                    maxTarget = Math.max(maxTarget, f.targetHours)
                }
            })

            // Include active fast if it's today
            if (activeFast && isToday && !activeFast.endTime) {
                const ms = now.getTime() - new Date(activeFast.startTime).getTime()
                totalHours += ms / (1000 * 60 * 60)
                maxTarget = Math.max(maxTarget, activeFast.targetHours)
            }

            days.push({
                date,
                label: isToday ? "TODAY" : format(date, "M/d"),
                hours: totalHours,
                target: maxTarget || 16,
                goalMet: totalHours >= (maxTarget || 16) && totalHours > 0,
                isToday
            })
        }
        return days
    }, [history, activeFast])

    const averageHours = useMemo(() => {
        const completedFasts = [...history]
            .filter(h => h.endTime)
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 7)
        if (completedFasts.length === 0) return 0
        const totalMs = completedFasts.reduce((acc, f) => {
            return acc + (new Date(f.endTime!).getTime() - new Date(f.startTime).getTime())
        }, 0)
        return totalMs / completedFasts.length / (1000 * 60 * 60)
    }, [history])

    const formatDurationRaw = (hours: number) => {
        const h = Math.floor(hours)
        const m = Math.round((hours - h) * 60)
        return { h, m }
    }

    const avg = formatDurationRaw(averageHours)
    const dateRange = `${format(last7DaysData[0].date, "MMM d")} - ${format(last7DaysData[6].date, "MMM d")}`

    const maxHours = Math.max(...last7DaysData.map(d => d.hours), 24)

    return (
        <div className="w-full bg-secondary/10 border border-border/50 rounded-3xl p-5 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{t.average}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-foreground tracking-tighter">{avg.h}{t.h}</span>
                            <span className="text-xl font-bold text-foreground/70 tracking-tight">{avg.m}{t.min}</span>
                        </div>
                    </div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-70">
                        {dateRange}
                    </p>
                </div>

                {/* Main Last 7 Days Chart (Rolling) */}
                <div className="h-44 flex items-end justify-between gap-1 relative px-1">
                    {/* Horizontal Guide Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <div
                            key={i}
                            className="absolute left-0 right-0 border-t border-border/10 pointer-events-none"
                            style={{ bottom: `${p * 100}%` }}
                        />
                    ))}

                    {last7DaysData.map((day, i) => {
                        const height = Math.min(100, (day.hours / 24) * 100)
                        const isToday = i === 6
                        const dayKey = format(day.date, "eee").toLowerCase() as keyof typeof t
                        const dayName = isToday ? (t.todayLowercase || "today") : (t[dayKey] || format(day.date, "M/d"))
                        const hasData = day.hours > 0

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10 h-full justify-end">
                                <div className="relative w-full flex flex-col items-center justify-end h-full">
                                    <div className="text-[10px] font-black text-foreground mb-1 tabular-nums transition-all">
                                        {hasData ? Math.round(day.hours) + (t.h || "h") : ""}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${hasData ? Math.max(10, height) : 0}%` }}
                                        className={`w-full max-w-[32px] rounded-t-xl transition-all flex justify-center pt-2 ${hasData ? "bg-primary/20 border-t-2 border-primary/50" : "bg-border/5"}`}
                                    >
                                        {hasData && (
                                            <div className={`w-2.5 h-2.5 rounded-full ${day.goalMet ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-orange-500/80"}`} />
                                        )}
                                    </motion.div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${isToday ? "text-primary" : "text-muted-foreground/50"}`}>
                                    {dayName as string}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-center justify-center gap-6 mb-4 text-[8px] font-black uppercase tracking-widest opacity-60">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{t.goalMet}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
                        <span>{t.goalNotMet}</span>
                    </div>
                </div>

                {(onAddClick || onSeeMoreClick) && (
                    <div className="flex flex-col gap-3 mt-6">
                        {onAddClick && (
                            <button
                                onClick={onAddClick}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-primary/10"
                            >
                                <Plus className="h-4 w-4" />
                                {t.addFast}
                            </button>
                        )}

                        {onSeeMoreClick && (
                            <button
                                onClick={onSeeMoreClick}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 text-foreground/80 font-bold text-xs transition-all border border-border/30"
                            >
                                <span>{t.seeMore}</span>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
