"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { X, Check, Plus, Edit2 } from "lucide-react"
import { FASTING_PRESETS, CUSTOM_PRESET } from "@/lib/presets"
import { useLang } from "@/lib/language-context"
import { type FastingRecord } from "@/lib/storage"

interface ManualFastDialogProps {
  onConfirm: (presetId: string, startTime: Date, endTime: Date, targetHours: number) => void
  onCancel: () => void
  editingRecord?: FastingRecord
}

export function ManualFastDialog({ onConfirm, onCancel, editingRecord }: ManualFastDialogProps) {
  const { t } = useLang()
  const now = new Date()
  const defaultStart = new Date(now.getTime() - 16 * 60 * 60 * 1000)

  const [presetId, setPresetId] = useState(editingRecord?.presetId || "16:8")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [targetHours, setTargetHours] = useState(editingRecord?.targetHours.toString() || "16")

  useEffect(() => {
    if (editingRecord) {
      const start = new Date(editingRecord.startTime)
      const end = editingRecord.endTime ? new Date(editingRecord.endTime) : now
      setStartDate(format(start, "yyyy-MM-dd"))
      setStartTime(format(start, "HH:mm"))
      setEndDate(format(end, "yyyy-MM-dd"))
      setEndTime(format(end, "HH:mm"))
    } else {
      setStartDate(format(defaultStart, "yyyy-MM-dd"))
      setStartTime(format(defaultStart, "HH:mm"))
      setEndDate(format(now, "yyyy-MM-dd"))
      setEndTime(format(now, "HH:mm"))
    }
  }, [editingRecord])

  function handleConfirm() {
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return
    if (end <= start) {
      alert("End time must be after start time")
      return
    }

    const hours = parseFloat(targetHours)
    if (isNaN(hours) || hours <= 0 || hours > 168) {
      alert("Target hours must be between 1 and 168")
      return
    }

    onConfirm(presetId, start, end, hours)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {editingRecord ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {editingRecord ? t.editPastFast : t.addPastFast}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t.preset}</label>
              <select
                value={presetId}
                onChange={(e) => {
                  setPresetId(e.target.value)
                  const preset = [...FASTING_PRESETS, CUSTOM_PRESET].find(p => p.id === e.target.value)
                  if (preset && preset.fastHours > 0) {
                    setTargetHours(preset.fastHours.toString())
                  }
                }}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              >
                {FASTING_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                <option value={CUSTOM_PRESET.id}>{t.customFast}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t.targetHours}</label>
              <input
                type="number"
                min="1"
                max="168"
                step="0.5"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground font-mono focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="bg-secondary/40 p-4 rounded-2xl space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 mb-1">{t.startTime}</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="bg-secondary/40 p-4 rounded-2xl space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 mb-1">{t.endTime}</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
          >
            {t.back}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-95"
          >
            <Check className="h-4 w-4" />
            {editingRecord ? t.save : t.addFastBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
