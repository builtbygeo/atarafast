"use client"

import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns"
import type { FastingRecord } from "@/lib/storage"
import { useLang } from "@/lib/language-context"

interface WeekStripProps {
  history: FastingRecord[]
}

export function WeekStrip({ history }: WeekStripProps) {
  const { t, lang } = useLang()
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const dayNames = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun]

  function hasFastOnDay(day: Date): boolean {
    return history.some((record) => {
      const start = new Date(record.startTime)
      const end = record.endTime ? new Date(record.endTime) : new Date()
      return isSameDay(start, day) || isSameDay(end, day)
    })
  }

  const streak = (() => {
    const daysWithFasts = new Set<string>()
    history.forEach((r) => {
      if (r.completed && r.endTime) {
        daysWithFasts.add(new Date(r.endTime).toDateString())
        daysWithFasts.add(new Date(r.startTime).toDateString())
      }
    })

    let current = 0
    let checkDate = new Date()

    while (true) {
      if (daysWithFasts.has(checkDate.toDateString())) {
        current++
        checkDate = addDays(checkDate, -1)
      } else {
        if (current === 0 && isToday(checkDate)) {
          checkDate = addDays(checkDate, -1)
        } else {
          break
        }
      }
    }
    return current
  })()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-3">
        {days.map((day) => {
          const fasted = hasFastOnDay(day)
          const today = isToday(day)
          return (
            <div key={day.toISOString()} className="flex flex-col items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${today ? "text-primary" : "text-muted-foreground/60"}`}>
                {dayNames[days.indexOf(day)]}
              </span>
              <div
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${fasted
                  ? "border-primary bg-primary text-primary-foreground"
                  : today
                    ? "border-primary text-foreground"
                    : "border-muted text-muted-foreground"
                  }`}
              >
                {format(day, "d")}
              </div>
            </div>
          )
        })}
      </div>
      {streak >= 2 && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold border border-orange-500/20 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          🔥 {t.streak.replace("{{count}}", streak.toString())}
        </div>
      )}
    </div>
  )
}
