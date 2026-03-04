"use client"

import { useState } from "react"
import { X, Download, Upload, Trash2, Sun, Moon, Monitor, ChevronUp, ChevronDown, Circle, Triangle } from "lucide-react"
import { useTheme } from "next-themes"
import { getSettings, updateSettings, exportData, importData, clearAllData, type AppSettings } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, BellOff } from "lucide-react"

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  onDataCleared: () => void
}

export function SettingsSheet({ open, onClose, onDataCleared }: SettingsSheetProps) {
  const { t } = useLang()
  const { theme, setTheme } = useTheme()
  const { permission, requestPermission } = useNotifications()
  const [settings, setSettingsState] = useState<AppSettings>(getSettings())
  const [confirmClear, setConfirmClear] = useState(false)

  if (!open) return null

  function handleTimerDirection(dir: "up" | "down") {
    updateSettings({ timerDirection: dir })
    setSettingsState((prev) => ({ ...prev, timerDirection: dir }))
  }

  function handleTimerStyle(style: "circle" | "triangle") {
    updateSettings({ timerStyle: style })
    setSettingsState((prev) => ({ ...prev, timerStyle: style }))
  }

  function handleImport() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (re) => {
        const content = re.target?.result as string
        if (importData(content)) {
          alert(t.importSuccess)
          onDataCleared() // Refresh UI
          onClose()
        } else {
          alert(t.importError)
        }
      }
      reader.readAsText(file)
    }
    input.click()
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
          {/* Account Section (MVP structure) */}
          <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.authTitle}</h3>
            <div className="flex flex-col gap-2">
              <button
                className="w-full relative flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 active:scale-[0.98] transition-all overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                <span className="relative">{t.signIn}</span>
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-1">
                {t.authDescription} <span className="text-primary/60 font-bold">({t.comingSoon})</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Timer Style */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Visual Style</p>
              <p className="text-xs text-muted-foreground uppercase tracking-tight opacity-60">
                {settings.timerStyle === "circle" ? "Classic Circle" : "New Triangle"}
              </p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => handleTimerStyle("circle")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${settings.timerStyle === "circle"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Circle className="h-3 w-3" />
                Circle
              </button>
              <button
                onClick={() => handleTimerStyle("triangle")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${settings.timerStyle === "triangle"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Triangle className="h-3 w-3" />
                Triangle
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${settings.timerDirection === "up"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
              >
                <ChevronUp className="h-3 w-3" />
                Up
              </button>
              <button
                onClick={() => handleTimerDirection("down")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${settings.timerDirection === "down"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${theme === value
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

          {/* Notifications */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm font-bold text-foreground">{t.notifications}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t.notificationsDesc}</p>
            </div>
            <button
              onClick={requestPermission}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${permission === "granted"
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-secondary border-border text-muted-foreground hover:text-foreground active:scale-95"
                }`}
            >
              {permission === "granted" ? (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  {t.confirm}
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5" />
                  {t.allowNotifications}
                </>
              )}
            </button>
          </div>

          <div className="h-px bg-border" />

          {/* Data Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 ml-1">{t.data}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/50 p-4 transition-all hover:bg-secondary active:scale-95 border border-border/50"
              >
                <Download className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.exportData}</span>
              </button>
              <button
                onClick={handleImport}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/50 p-4 transition-all hover:bg-secondary active:scale-95 border border-border/50"
              >
                <Upload className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.importData}</span>
              </button>
            </div>
          </div>

          {/* Clear */}
          <button
            onClick={handleClear}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${confirmClear
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
