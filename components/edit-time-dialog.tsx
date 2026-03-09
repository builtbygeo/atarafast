"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Check } from "lucide-react"
import { useLang } from "@/lib/language-context"

interface EditTimeDialogProps {
  currentTime: Date
  label: string
  onConfirm: (newTime: Date) => void
  onCancel: () => void
}

export function EditTimeDialog({ currentTime, label, onConfirm, onCancel }: EditTimeDialogProps) {
  const { t } = useLang()
  const [date, setDate] = useState(format(currentTime, "yyyy-MM-dd"))
  const [time, setTime] = useState(format(currentTime, "HH:mm"))

  function handleConfirm() {
    const newTime = new Date(`${date}T${time}`)
    if (isNaN(newTime.getTime())) return
    onConfirm(newTime)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-[320px] rounded-[2.5rem] border border-white/10 bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-foreground tracking-tight">{label}</h3>
          <button
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-1">{t.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-border/50 bg-secondary/20 px-4 py-4 text-sm font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-1">{t.time}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-2xl border border-border/50 bg-secondary/20 px-4 py-4 text-sm font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            <Check className="h-4 w-4" />
            {t.save}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl bg-secondary/50 py-4 text-sm font-black uppercase tracking-widest text-foreground active:scale-95 transition-all"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
