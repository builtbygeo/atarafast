"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { format, subDays, startOfDay, endOfDay, isSameDay } from "date-fns"
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

        for (let i = 6; i >= 0; i--) {
            const date = subDays(now, i)
            const dateStart = startOfDay(date)

            // Find history records for this day (based on startTime)
            const dayFasts = history.filter(f => isSameDay(new Date(f.startTime), date))

            // Calculate total duration for this day (in hours)
            let totalHours = 0
            let targetHours = 0

            dayFasts.forEach(f => {
                if (f.endTime) {
                    const ms = new Date(f.endTime).getTime() - new Date(f.startTime).getTime()
                    totalHours += ms / (1000 * 60 * 60)
                    targetHours = Math.max(targetHours, f.targetHours)
                }
            })

            // Include active fast if it started today
            if (activeFast && isSameDay(new Date(activeFast.startTime), date)) {
                const ms = now.getTime() - new Date(activeFast.startTime).getTime()
                totalHours += ms / (1000 * 60 * 60)
                targetHours = Math.max(targetHours, activeFast.targetHours)
            }

            days.push({
                date,
                label: i === 0 ? "Today" : format(date, "M/d"),
                hours: totalHours,
                target: targetHours || 16, // Default target for visuals if none
                goalMet: totalHours >= (targetHours || 16) && totalHours > 0
            })
        }
        return days
    }, [history, activeFast])

    const averageHours = useMemo(() => {
        const completedFasts = history.filter(h => h.endTime).slice(0, 7)
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
        <div className="w-full bg-secondary/10 border border-border/50 rounded-3xl p-5 mb-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{t.average}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-foreground tracking-tighter">{avg.h}h</span>
                        <span className="text-xl font-bold text-foreground/70 tracking-tight">{avg.m}m</span>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 opacity-70">
                    {dateRange}
                </p>
            </div>

            <div className="h-32 flex items-end justify-between gap-1 relative mb-8">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <div
                        key={i}
                        className="absolute left-0 right-[-24px] border-t border-border/20 pointer-events-none"
                        style={{ bottom: `${p * 100}%` }}
                    />
                ))}
                {/* Hour markers on the right */}
                <div className="absolute right-[-24px] top-0 bottom-0 flex flex-col justify-between py-1 text-[8px] font-black text-muted-foreground/40 pointer-events-none">
                    <span>{Math.round(maxHours)}</span>
                    <span>{Math.round(maxHours * 0.75)}</span>
                    <span>{Math.round(maxHours * 0.5)}</span>
                    <span>{Math.round(maxHours * 0.25)}</span>
                    <span>0</span>
                </div>

                {last7DaysData.map((day, i) => {
                    const height = (day.hours / maxHours) * 100
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                            <div className="relative w-full flex flex-col items-center justify-end h-full">
                                {day.hours > 0 && (
                                    <span className="absolute -top-5 text-[9px] font-black text-foreground/60 transition-opacity opacity-0 group-hover:opacity-100">
                                        {Math.round(day.hours)}h
                                    </span>
                                )}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(4, height)}%` }}
                                    className={`w-3.5 rounded-full transition-shadow group-hover:shadow-[0_0_15px_-3px_var(--chart-color)] ${day.hours === 0 ? "bg-muted/20" : day.goalMet ? "bg-primary" : "bg-orange-500/80"
                                        }`}
                                    style={{
                                        "--chart-color": day.goalMet ? "oklch(var(--primary))" : "oklch(0.6 0.15 35)"
                                    } as any}
                                />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tight ${i === 6 ? "text-primary" : "text-muted-foreground/60"}`}>
                                {day.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-center gap-6 mb-8 text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{t.goalMet}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500/80" />
                    <span className="text-muted-foreground">{t.goalNotMet}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={onAddClick}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] border border-primary/10"
                >
                    <Plus className="h-3.5 w-3.5" />
                    {t.addFast}
                </button>

                <button
                    onClick={onSeeMoreClick}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 text-foreground/80 font-bold text-xs transition-all active:scale-[0.98] border border-border/30"
                >
                    <span>{t.seeMore}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
            </div>
        </div>
    )
}
