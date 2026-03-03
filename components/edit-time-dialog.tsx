"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Check } from "lucide-react"

interface EditTimeDialogProps {
  currentTime: Date
  label: string
  onConfirm: (newTime: Date) => void
  onCancel: () => void
}

export function EditTimeDialog({ currentTime, label, onConfirm, onCancel }: EditTimeDialogProps) {
  const [date, setDate] = useState(format(currentTime, "yyyy-MM-dd"))
  const [time, setTime] = useState(format(currentTime, "HH:mm"))

  function handleConfirm() {
    const newTime = new Date(`${date}T${time}`)
    if (isNaN(newTime.getTime())) return
    onConfirm(newTime)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{label}</h3>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
