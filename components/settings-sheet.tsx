"use client"

import { useState } from "react"
import { X, Download, Upload, Trash2, Sun, Moon, Monitor, ChevronUp, ChevronDown, Circle, Triangle, Bell, BellOff, Sparkles, LogOut, User as UserIcon, Lock } from "lucide-react"
import { useTheme } from "next-themes"
import { getSettings, updateSettings, exportData, importData, clearAllData, type AppSettings } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { useNotifications } from "@/hooks/use-notifications"
import { useSubscription, startCheckout } from "@/lib/subscription"
import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  onDataCleared: () => void
  onOpenUpgrade?: () => void
}

export function SettingsSheet({ open, onClose, onDataCleared, onOpenUpgrade }: SettingsSheetProps) {
  const { t } = useLang()
  const { theme, setTheme } = useTheme()
  const { permission, requestPermission } = useNotifications()
  const { isPremium, isTrialing, trialDaysLeft, isSignedIn, isLoaded: subLoaded, status, stripeCustomerId } = useSubscription()
  const { user } = useUser()
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

  function handleToggleNotifications() {
    if (permission !== "granted") {
      requestPermission().then((res) => {
        if (res === "granted") {
          updateSettings({ notificationsEnabled: true })
          setSettingsState((prev) => ({ ...prev, notificationsEnabled: true }))
        }
      })
    } else {
      const newVal = !settings.notificationsEnabled
      updateSettings({ notificationsEnabled: newVal })
      setSettingsState((prev) => ({ ...prev, notificationsEnabled: newVal }))
    }
  }

  function handleImport() {
    if (!isPremium) {
      onOpenUpgrade?.()
      return
    }
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
    if (!isPremium) {
      onOpenUpgrade?.()
      return
    }
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
      <div className="relative z-50 w-full max-w-md max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-background border border-border pb-6 pt-0 px-0 shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4 px-6 pt-6 shrink-0 sticky top-0 bg-background/95 backdrop-blur-md pb-4 z-10 border-b border-border/50 rounded-t-2xl sm:rounded-2xl">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-2 no-scrollbar">
          {/* Account Section */}
          <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.authTitle}</h3>
            {!isSignedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-up"
                  className="w-full relative flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 active:scale-[0.98] transition-all overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                  <span className="relative">Create Free Account</span>
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full text-center py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate mb-1">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-card rounded-xl border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isPremium ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground border border-border'}`}>
                      {isPremium ? (isTrialing ? '14-Day Free Trial' : 'Atara Pro') : 'Free Plan'}
                    </span>
                  </div>

                  {isTrialing && (
                    <p className="text-xs text-muted-foreground font-medium">
                      Trial ends in <span className="text-primary font-bold">{trialDaysLeft} days</span>. Upgrade to keep full access!
                    </p>
                  )}

                  {!isTrialing && isPremium && (
                    <p className="text-xs text-muted-foreground font-medium">
                      You have full access to all metabolic tracking features.
                    </p>
                  )}

                  {!isPremium && !isTrialing && (
                    <p className="text-xs text-muted-foreground font-medium">
                      Your free trial has expired. Upgrade to Atara+ for full access.
                    </p>
                  )}

                  <button
                    onClick={stripeCustomerId ? () => startCheckout() : onOpenUpgrade}
                    className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {stripeCustomerId ? 'Manage Subscription' : 'View Upgrade Plans'}
                  </button>
                </div>

                <SignOutButton>
                  <button className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-destructive/70 hover:text-destructive transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
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

          {/* Post-Fast Journal */}
          <div className="flex items-center justify-between pb-2 pt-1">
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Post-Fast Journal
                {!isPremium && <Lock className="h-3 w-3 text-primary/50" />}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Log reflection after fasts
              </p>
            </div>
            <button
              onClick={() => {
                if (!isPremium) {
                  onOpenUpgrade?.();
                  return;
                }
                const newVal = !settings.journalEnabled;
                updateSettings({ journalEnabled: newVal });
                setSettingsState((prev) => ({ ...prev, journalEnabled: newVal }));
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${settings.journalEnabled && isPremium ? 'bg-primary' : 'bg-secondary'
                }`}
              role="switch"
              aria-checked={settings.journalEnabled}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.journalEnabled ? 'translate-x-[20px]' : 'translate-x-[2px]'
                  }`}
              />
            </button>
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

          {/* Feedback */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm font-bold text-foreground">Feedback</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Help us improve</p>
            </div>
            <a
              href="mailto:support@atarafast.com"
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 border border-border/50 text-center"
            >
              Send Feedback
            </a>
          </div>

          <div className="h-px bg-border" />

          {/* Notifications */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm font-bold text-foreground">{t.notifications}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t.notificationsDesc}</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${settings.notificationsEnabled && permission === "granted"
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-secondary border-border text-muted-foreground hover:text-foreground active:scale-95"
                }`}
            >
              {settings.notificationsEnabled && permission === "granted" ? (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  {t.on || "On"}
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5" />
                  {permission === "granted" ? (t.off || "Off") : (t.allowNotifications || "Enable")}
                </>
              )}
            </button>
          </div>

          <div className="h-px bg-border" />

          {/* Dev Mode Options */}
          {process.env.NODE_ENV === "development" && (
            <>
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="text-sm font-bold text-[#22c55e]">Force Premium (Dev)</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Local testing only</p>
                </div>
                <button
                  onClick={() => {
                    const newVal = !settings.devForcePremium;
                    updateSettings({ devForcePremium: newVal });
                    setSettingsState((prev) => ({ ...prev, devForcePremium: newVal }));
                    window.location.reload(); // Reload to apply across the app immediately
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${settings.devForcePremium ? 'bg-[#22c55e]' : 'bg-secondary'
                    }`}
                  role="switch"
                  aria-checked={settings.devForcePremium}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.devForcePremium ? 'translate-x-[20px]' : 'translate-x-[2px]'
                      }`}
                  />
                </button>
              </div>
              <div className="h-px bg-border" />
            </>
          )}

          {/* Data Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 ml-1">{t.data}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={isPremium ? handleExport : onOpenUpgrade}
                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/50 p-4 transition-all hover:bg-secondary active:scale-95 border border-border/50"
              >
                {!isPremium && <div className="absolute top-2 right-2"><Lock className="w-3 h-3 text-primary/50" /></div>}
                <Download className={`h-5 w-5 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${!isPremium ? 'text-muted-foreground' : ''}`}>{t.exportData}</span>
              </button>
              <button
                onClick={isPremium ? handleImport : onOpenUpgrade}
                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/50 p-4 transition-all hover:bg-secondary active:scale-95 border border-border/50"
              >
                {!isPremium && <div className="absolute top-2 right-2"><Lock className="w-3 h-3 text-primary/50" /></div>}
                <Upload className={`h-5 w-5 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${!isPremium ? 'text-muted-foreground' : ''}`}>{t.importData}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-border text-transparent select-none">-</div>

          {/* Onboarding */}
          <button
            onClick={() => {
              updateSettings({ hasCompletedOnboarding: false });
              window.location.reload();
            }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 border border-border/50 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Retake Onboarding Quiz
          </button>

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
