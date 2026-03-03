"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isAfter,
} from "date-fns"
import { Trash2, Clock, CheckCircle2, Plus, Edit2 } from "lucide-react"
import { type FastingRecord, deleteHistoryRecord, addManualFast, updateHistoryRecord } from "@/lib/storage"
import { getPresetById } from "@/lib/presets"
import { ManualFastDialog } from "@/components/manual-fast-dialog"
import { useLang } from "@/lib/language-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface HistoryViewProps {
  history: FastingRecord[]
  onHistoryChange: () => void
}

export function HistoryView({ history, onHistoryChange }: HistoryViewProps) {
  const { t } = useLang()
  const [selectedYear] = useState(new Date().getFullYear())
  const [showManualFastDialog, setShowManualFastDialog] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const [recordToEdit, setRecordToEdit] = useState<FastingRecord | null>(null)

  const fastDays = useMemo(() => {
    const days = new Set<string>()
    history.forEach((record) => {
      const start = new Date(record.startTime)
      days.add(format(start, "yyyy-MM-dd"))
      if (record.endTime) {
        const end = new Date(record.endTime)
        days.add(format(end, "yyyy-MM-dd"))
      }
    })
    return days
  }, [history])

  const yearStart = startOfYear(new Date(selectedYear, 0, 1))
  const yearEnd = endOfYear(yearStart)
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })
  const today = new Date()

  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [history]
  )

  function handleDelete() {
    if (recordToDelete) {
      deleteHistoryRecord(recordToDelete)
      setRecordToDelete(null)
      onHistoryChange()
    }
  }

  function handleAddManualFast(presetId: string, startTime: Date, endTime: Date, targetHours: number) {
    addManualFast(presetId, startTime, endTime, targetHours)
    setShowManualFastDialog(false)
    onHistoryChange()
  }

  function handleUpdateFast(presetId: string, startTime: Date, endTime: Date, targetHours: number) {
    if (recordToEdit) {
      updateHistoryRecord(recordToEdit.id, {
        presetId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        targetHours,
      })
      setRecordToEdit(null)
      onHistoryChange()
    }
  }

  function formatDuration(startTime: string, endTime: string | null): string {
    if (!endTime) return t.timer
    const ms = new Date(endTime).getTime() - new Date(startTime).getTime()
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-foreground">{t.historyTitle}</h2>
        <button
          onClick={() => setShowManualFastDialog(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.addFast}
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{t.yearCalendar.replace("{{year}}", String(selectedYear))}</p>

      {/* Year calendar heatmap */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8 overflow-x-auto">
        <div className="flex flex-col gap-3 min-w-[300px]">
          {months.map((month) => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)
            const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
            const firstDayOffset = (getDay(monthStart) + 6) % 7

            return (
              <div key={month.toISOString()} className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground w-7 shrink-0">
                  {format(month, "MMM")}
                </span>
                <div className="flex gap-[3px] flex-wrap">
                  {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-[10px] w-[10px]" />
                  ))}
                  {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd")
                    const fasted = fastDays.has(dateKey)
                    const isFuture = isAfter(day, today)
                    return (
                      <div
                        key={dateKey}
                        className={`h-[10px] w-[10px] rounded-[2px] transition-colors ${isFuture
                          ? "bg-muted/30"
                          : fasted
                            ? "bg-primary"
                            : "bg-muted"
                          }`}
                        title={`${format(day, "MMM d")}${fasted ? " - Fasted" : ""}`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent fasts list */}
      <h3 className="text-sm font-semibold text-foreground mb-3">{t.recentFasts}</h3>
      {sortedHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">{t.noHistory}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.startFirstFast}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedHistory.slice(0, 20).map((record) => {
            const preset = getPresetById(record.presetId)
            return (
              <div
                key={record.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: preset?.color || "oklch(0.5 0 0)" }}
                >
                  {record.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {preset?.name || record.presetId} &middot; {formatDuration(record.startTime, record.endTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(record.startTime), "MMM d, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRecordToEdit(record)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Edit fast record"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setRecordToDelete(record.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete fast record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showManualFastDialog && (
        <ManualFastDialog
          onConfirm={handleAddManualFast}
          onCancel={() => setShowManualFastDialog(false)}
        />
      )}

      {recordToEdit && (
        <ManualFastDialog
          editingRecord={recordToEdit}
          onConfirm={handleUpdateFast}
          onCancel={() => setRecordToEdit(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!recordToDelete} onOpenChange={() => setRecordToDelete(null)}>
        <AlertDialogContent className="max-w-[320px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">{t.confirmDeleteHistory}</AlertDialogTitle>
            <AlertDialogDescription className="text-center mt-2">
              {t.deleteHistoryText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:flex-row sm:justify-center mt-4">
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              {t.delete}
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 rounded-xl bg-secondary text-secondary-foreground border-none m-0">
              {t.back}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
