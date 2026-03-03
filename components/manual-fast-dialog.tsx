"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Check, Plus } from "lucide-react"
import { FASTING_PRESETS, CUSTOM_PRESET } from "@/lib/presets"
import { useLang } from "@/lib/language-context"

interface ManualFastDialogProps {
  onConfirm: (presetId: string, startTime: Date, endTime: Date, targetHours: number) => void
  onCancel: () => void
}

export function ManualFastDialog({ onConfirm, onCancel }: ManualFastDialogProps) {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  const [presetId, setPresetId] = useState("16:8")
  const [startDate, setStartDate] = useState(format(yesterday, "yyyy-MM-dd"))
  const [startTime, setStartTime] = useState("20:00")
  const [endDate, setEndDate] = useState(format(now, "yyyy-MM-dd"))
  const [endTime, setEndTime] = useState("12:00")
  const [targetHours, setTargetHours] = useState("16")

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
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg my-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Add Past Fast</h3>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Preset</label>
            <select
              value={presetId}
              onChange={(e) => {
                setPresetId(e.target.value)
                const preset = [...FASTING_PRESETS, CUSTOM_PRESET].find(p => p.id === e.target.value)
                if (preset) {
                  setTargetHours(preset.fastHours.toString())
                }
              }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {FASTING_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
              <option value={CUSTOM_PRESET.id}>{CUSTOM_PRESET.name}</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Target Hours</label>
            <input
              type="number"
              min="1"
              max="168"
              step="0.5"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            Add Fast
          </button>
        </div>
      </div>
    </div>
  )
}
