"use client"

import { useMemo } from "react"
import { format, subDays, isSameDay } from "date-fns"
import { type FastingRecord } from "@/lib/storage"

interface WeekStatusStripProps {
    history: FastingRecord[]
    activeFast?: FastingRecord | null
}

export function WeekStatusStrip({ history, activeFast }: WeekStatusStripProps) {
    const weekData = useMemo(() => {
        const days = []
        const now = new Date()

        // Last 7 days including today (like Zero)
        for (let i = 6; i >= 0; i--) {
            const date = subDays(now, i)
            const dayFasts = history.filter(f => isSameDay(new Date(f.startTime), date))

            const isToday = i === 0
            const hasCompleted = dayFasts.some(f => f.completed)
            const isActive = activeFast && isSameDay(new Date(activeFast.startTime), date)

            days.push({
                date,
                label: format(date, "EEE").toUpperCase(),
                status: hasCompleted ? "completed" : isActive ? "active" : "none",
                isToday
            })
        }
        return days
    }, [history, activeFast])

    return (
        <div className="flex items-center justify-between w-full px-2 py-4 mb-2">
            {weekData.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${day.isToday ? "text-primary" : "text-muted-foreground/60"}`}>
                        {day.label}
                    </span>
                    <div className="relative">
                        <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${day.status === "completed"
                                ? "border-primary bg-primary/10"
                                : day.status === "active"
                                    ? "border-primary/40 border-dashed animate-[spin_10s_linear_infinite]"
                                    : "border-border/40"
                            }`} />
                        {day.status === "completed" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                        )}
                        {day.isToday && day.status === "none" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
