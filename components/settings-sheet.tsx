"use client"

import { useState } from "react"
import { X, Download, Trash2, Sun, Moon, Monitor, ChevronUp, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { getSettings, updateSettings, exportData, clearAllData, type AppSettings } from "@/lib/storage"
import { useLang } from "@/lib/language-context"

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  onDataCleared: () => void
}

export function SettingsSheet({ open, onClose, onDataCleared }: SettingsSheetProps) {
  const { theme, setTheme } = useTheme()
  const [settings, setSettingsState] = useState<AppSettings>(getSettings())
  const [confirmClear, setConfirmClear] = useState(false)

  if (!open) return null

  function handleTimerDirection(dir: "up" | "down") {
    updateSettings({ timerDirection: dir })
    setSettingsState((prev) => ({ ...prev, timerDirection: dir }))
  }

  function handleExport() {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fasttrack-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearAllData()
    onDataCleared()
    setConfirmClear(false)
    onClose()
  }

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-background border border-border p-6 shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Timer Direction */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Timer direction</p>
              <p className="text-xs text-muted-foreground">
                {settings.timerDirection === "down" ? "Counting down to goal" : "Counting up from start"}
              </p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => handleTimerDirection("up")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  settings.timerDirection === "up"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <ChevronUp className="h-3 w-3" />
                Up
              </button>
              <button
                onClick={() => handleTimerDirection("down")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  settings.timerDirection === "down"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <ChevronDown className="h-3 w-3" />
                Down
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Theme */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Theme</p>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    theme === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            Export data as JSON
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              confirmClear
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-destructive hover:bg-destructive/10"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            {confirmClear ? "Tap again to confirm" : "Clear all data"}
          </button>
        </div>
      </div>
    </div>
  )
}
