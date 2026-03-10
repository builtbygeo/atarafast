"use client"

import { useMemo, memo } from "react"
import { format, subDays, isSameDay } from "date-fns"
import { type FastingRecord } from "@/lib/storage"

interface WeekStatusStripProps {
    history: FastingRecord[]
    activeFast?: FastingRecord | null
}

export const WeekStatusStrip = memo(function WeekStatusStrip({ history, activeFast }: WeekStatusStripProps) {
    const weekData = useMemo(() => {
        const days = []
        const now = new Date()

        // Last 30 days including today (like Zero)
        for (let i = 6; i >= 0; i--) {
            const date = subDays(now, i)
            const dayFasts = history.filter(f => isSameDay(new Date(f.startTime), date))

            const isToday = i === 0
            const isActive = activeFast && isSameDay(new Date(activeFast.startTime), date)

            let totalHours = 0
            let hasCompleted = false

            dayFasts.forEach(f => {
                if (f.endTime) {
                    totalHours += (new Date(f.endTime).getTime() - new Date(f.startTime).getTime()) / (1000 * 3600)
                    if (f.completed) hasCompleted = true
                }
            })

            if (isActive) {
                const currentHours = (now.getTime() - new Date(activeFast.startTime).getTime()) / (1000 * 3600)
                totalHours += currentHours
                if (currentHours >= activeFast.targetHours) hasCompleted = true
            }

            const goalMet = hasCompleted && totalHours > 0

            days.push({
                date,
                label: format(date, "EEE").toUpperCase(),
                hours: totalHours,
                goalMet,
                isActive,
                isToday
            })
        }
        return days
    }, [history, activeFast])

    return (
        <div className="flex items-center justify-between w-full px-2 py-4 mb-2">
            {weekData.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${day.isToday ? "text-primary" : "text-muted-foreground/60"}`}>
                        {day.label}
                    </span>
                    <div className="relative">
                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${day.hours > 0
                            ? (day.goalMet ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]" : "border-orange-500/50 bg-orange-500/5")
                            : (day.isActive ? "border-primary/40 border-dashed animate-[spin_10s_linear_infinite]" : "border-border/40")
                            }`}>
                            {day.hours > 0 && (
                                <span className={`text-[9px] font-black tabular-nums transition-colors ${day.goalMet ? "text-primary" : "text-orange-500"}`}>
                                    {Math.round(day.hours)}
                                </span>
                            )}
                            {!day.hours && day.isToday && !day.isActive && (
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
})
