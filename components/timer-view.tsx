"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgress } from "@/components/circular-progress"
import { PresetGrid } from "@/components/preset-grid"
import { PresetDetail } from "@/components/preset-detail"
import { WeekStatusStrip } from "@/components/week-status-strip"
import {
  Trash2,
  Clock,
  Timer,
  Settings as SettingsIcon,
} from "lucide-react"
import {
  startFast,
  endFast,
  getActiveFast,
  getSettings,
  updateActiveFast,
  deleteFast,
  getLastFastInfo,
  addManualFast,
  type FastingRecord,
} from "@/lib/storage"
import { getPresetById, type FastingPreset } from "@/lib/presets"
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
import { useLang } from "@/lib/language-context"
import { useNotifications } from "@/hooks/use-notifications"
import { format, addHours } from "date-fns"

type ViewState = "timer" | "presets" | "detail"

interface TimerViewProps {
  history: FastingRecord[]
  onFastEnd?: () => void
  onNavigateToHistory?: () => void
}

const haptic = (vibration = [50]) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(vibration)
  }
}

export function TimerView({ history, onFastEnd, onNavigateToHistory }: TimerViewProps) {
  const { t } = useLang()
  const { sendNotification } = useNotifications()
  const [activeFast, setActiveFast] = useState<FastingRecord | null>(null)
  const [viewState, setViewState] = useState<ViewState>("presets")
  const [direction, setDirection] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState<FastingPreset | null>(null)
  const [now, setNow] = useState(new Date())
  const [settings, setSettings] = useState<ReturnType<typeof getSettings>>({ timerDirection: "down" })
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const navigateTo = useCallback(
    (newState: ViewState) => {
      const order = { timer: 0, presets: 1, detail: 2 }
      setDirection(order[newState] > order[viewState] ? 1 : -1)
      setViewState(newState)
      haptic([30])
    },
    [viewState]
  )

  useEffect(() => {
    const fast = getActiveFast()
    const sett = getSettings()
    setActiveFast(fast)
    setSettings(sett)
    if (fast) setViewState("timer")
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!activeFast) return
    const interval = setInterval(() => {
      const currentNow = new Date()
      setNow(currentNow)

      const start = new Date(activeFast.startTime)
      const targetMs = activeFast.targetHours * 3600000
      const elapsedMs = currentNow.getTime() - start.getTime()

      if (elapsedMs >= targetMs && elapsedMs < targetMs + 2000) {
        sendNotification(t.targetReached, {
          body: `${activeFast.presetId} fast complete!`,
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [activeFast, sendNotification, t.targetReached])

  const handleSelectPreset = useCallback((preset: FastingPreset) => {
    setSelectedPreset(preset)
    navigateTo("detail")
  }, [navigateTo])

  const handleStartFast = (hours: number) => {
    if (!selectedPreset) return
    const record = activeFast
      ? updateActiveFast(selectedPreset.id, hours)
      : startFast(selectedPreset.id, hours)

    if (record) {
      setActiveFast(record)
      navigateTo("timer")
      setNow(new Date())
      haptic([100, 50])
    }
  }

  const handleEndFast = useCallback(() => {
    const record = endFast()
    if (record) {
      setActiveFast(null)
      navigateTo("presets")
      onFastEnd?.()
    }
  }, [onFastEnd, navigateTo])

  const handleDiscardFast = useCallback(() => {
    deleteFast()
    setActiveFast(null)
    navigateTo("presets")
    setShowDeleteConfirm(false)
  }, [navigateTo])

  const handleQuickStart = useCallback(() => {
    const lastInfo = getLastFastInfo()
    if (lastInfo) {
      const record = startFast(lastInfo.presetId, lastInfo.targetHours)
      setActiveFast(record)
      navigateTo("timer")
      setNow(new Date())
      haptic([100, 50])
    }
  }, [navigateTo])

  if (!mounted) return null

  const renderTimerContent = () => {
    if (!activeFast) return null
    const preset = getPresetById(activeFast.presetId)
    const startTime = new Date(activeFast.startTime)
    const elapsedMs = now.getTime() - startTime.getTime()
    const targetMs = activeFast.targetHours * 3600000
    const remainingMs = Math.max(0, targetMs - elapsedMs)
    const isComplete = elapsedMs >= targetMs
    const percentage = Math.min(100, Math.floor((elapsedMs / targetMs) * 100))

    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const hoursOverTarget = isComplete ? (elapsedMs - targetMs) / 3600000 : 0
    const goalTime = addHours(startTime, activeFast.targetHours)

    return (
      <div className="flex flex-col items-center h-full py-2 overflow-y-auto w-full px-4 no-scrollbar">
        <WeekStatusStrip history={history} activeFast={activeFast} />

        <div className="flex flex-col items-center text-center mt-6 mb-8 w-full">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <CircularProgress
              progress={percentage / 100}
              size={260}
              strokeWidth={12}
              color={preset?.color || "oklch(0.6 0.1 260)"}
            >
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-foreground font-mono tabular-nums tracking-tighter">
                  {formatTime(settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs)}
                </span>
                <span className="text-[10px] font-black text-muted-foreground mt-3 uppercase tracking-[0.2em] opacity-60">
                  {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
                </span>
              </div>
            </CircularProgress>
          </motion.div>

          <div className="flex gap-4 mt-12 w-full max-w-sm px-4">
            <div className="flex-1 bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-1">{t.startTime.toUpperCase()}</span>
              <span className="block text-sm font-black text-foreground">{format(startTime, "EEE, HH:mm")}</span>
            </div>
            <div className="flex-1 bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-1">{`${activeFast.targetHours}H ${t.goal.toUpperCase()}`}</span>
              <span className="block text-sm font-black text-foreground">{format(goalTime, "EEE, HH:mm")}</span>
            </div>
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 rounded-3xl bg-primary/10 border border-primary/20 max-w-[280px]">
              <p className="text-sm font-black text-primary leading-tight">
                {hoursOverTarget < 1 ? t.targetReached : t.overTarget.replace("{{hours}}", hoursOverTarget.toFixed(1))}
              </p>
            </motion.div>
          )}

          <h3 className="text-2xl font-black text-foreground mt-10 tracking-tight">{preset?.name || activeFast.presetId}</h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2 opacity-50">
            {activeFast.targetHours}{t.hours} {t.fastLabel}
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs mt-auto pb-8">
          <div className="grid grid-cols-[1fr_2fr_auto] gap-3">
            <button onClick={() => navigateTo("presets")} className="flex h-14 items-center justify-center rounded-2xl bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-95 border border-border/50">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndFast}
              className={`h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isComplete ? "bg-primary text-primary-foreground shadow-primary/30" : "bg-card text-foreground border border-border"
                }`}
            >
              {t.endFast}
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="h-14 w-14 flex items-center justify-center rounded-2xl bg-secondary/30 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90 border border-border/30">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="max-w-[320px] rounded-[2.5rem] border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center font-black text-xl">{t.confirmDeleteTitle}</AlertDialogTitle>
              <AlertDialogDescription className="text-center mt-3 text-sm font-medium leading-relaxed">
                {t.confirmDeleteText}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3 mt-8">
              <AlertDialogAction onClick={handleDiscardFast} className="flex-1 h-12 rounded-2xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-all">
                {t.delete}
              </AlertDialogAction>
              <AlertDialogCancel className="flex-1 h-12 rounded-2xl bg-secondary border-none m-0 font-bold">
                {t.back}
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  const renderPresetsContent = () => {
    const lastFastInfo = getLastFastInfo()
    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-2 no-scrollbar">
        <WeekStatusStrip history={history} activeFast={null} />

        <div className="mt-4">
          <PresetGrid onSelect={handleSelectPreset} />
        </div>

        <div className="mt-8 mb-8">
          {lastFastInfo && !activeFast && (
            <button
              onClick={handleQuickStart}
              className="w-full flex items-center justify-center gap-4 rounded-[2rem] bg-primary p-6 font-black text-primary-foreground shadow-2xl shadow-primary/40 active:scale-[0.97] transition-all text-xl"
            >
              <Clock className="h-7 w-7" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-[0.2em] opacity-70 mb-0.5">{t.quickStart}</span>
                <span className="block font-black">{getPresetById(lastFastInfo.presetId)?.name || lastFastInfo.presetId}</span>
              </div>
            </button>
          )}

          {activeFast && (
            <button onClick={() => navigateTo("timer")} className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl bg-secondary/50 font-black text-sm uppercase tracking-widest text-foreground active:scale-95 transition-all border border-border/50 shadow-lg mt-4">
              <Timer className="h-5 w-5" />
              {t.backToTimer}
            </button>
          )}

          <button
            onClick={onNavigateToHistory}
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 text-muted-foreground font-bold text-xs transition-all border border-border/20"
          >
            {t.seeMore}
          </button>
        </div>
      </div>
    )
  }

  const renderDetailContent = () => (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 no-scrollbar">
      {selectedPreset && (
        <PresetDetail
          preset={selectedPreset}
          onStart={handleStartFast}
          onBack={() => navigateTo("presets")}
          onUpdateFast={handleStartFast}
          isActive={!!activeFast}
          isCurrentActivePreset={activeFast?.presetId === selectedPreset.id}
        />
      )}
    </div>
  )

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden h-full">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={viewState}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
          className="absolute inset-0 flex flex-col pt-0"
        >
          {viewState === "timer" && renderTimerContent()}
          {viewState === "presets" && renderPresetsContent()}
          {viewState === "detail" && renderDetailContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
