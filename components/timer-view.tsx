"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgress } from "@/components/circular-progress"
import { WeekStrip } from "@/components/week-strip"
import { PresetGrid } from "@/components/preset-grid"
import { PresetDetail } from "@/components/preset-detail"
import {
  Trash2,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Timer,
  Settings as SettingsIcon,
} from "lucide-react"
import {
  startFast,
  endFast,
  getActiveFast,
  getHistory,
  getSettings,
  updateActiveFastStartTime,
  updateActiveFast,
  deleteFast,
  getLastFastInfo,
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

type ViewState = "timer" | "presets" | "detail"

interface TimerViewProps {
  onFastEnd?: () => void
}

const haptic = (vibration = [50]) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(vibration)
  }
}

export function TimerView({ onFastEnd }: TimerViewProps) {
  const { t } = useLang()
  const { sendNotification } = useNotifications()
  const [activeFast, setActiveFast] = useState<FastingRecord | null>(null)
  const [history, setHistory] = useState<FastingRecord[]>([])
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
    const hist = getHistory()
    const sett = getSettings()
    setActiveFast(fast)
    setHistory(hist)
    setSettings(sett)
    if (fast) setViewState("timer")
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!activeFast) return
    const interval = setInterval(() => {
      const currentNow = new Date()
      setNow(currentNow)

      // Notification logic
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

    if (activeFast) {
      updateActiveFast(selectedPreset.id, hours)
      const updated = { ...activeFast, presetId: selectedPreset.id, targetHours: hours }
      setActiveFast(updated)
      navigateTo("timer")
    } else {
      const record = startFast(selectedPreset.id, hours)
      setActiveFast(record)
      navigateTo("timer")
      setNow(new Date())
    }
    haptic([100, 50])
  }

  const handleEndFast = useCallback(() => {
    const record = endFast()
    if (record) {
      setActiveFast(null)
      setHistory(getHistory())
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

    return (
      <div className="flex flex-col items-center justify-between h-full py-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <CircularProgress
              progress={percentage / 100}
              size={280}
              strokeWidth={12}
              color={preset?.color || "oklch(0.6 0.1 260)"}
            >
              <span className="text-5xl font-black text-foreground font-mono tabular-nums tracking-tight">
                {formatTime(settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs)}
              </span>
              <span className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-60">
                {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
              </span>
            </CircularProgress>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 max-w-[240px]"
              >
                <p className="text-sm font-bold text-primary">
                  {hoursOverTarget < 1
                    ? t.targetReached
                    : t.overTarget.replace("{{hours}}", hoursOverTarget.toFixed(1))}
                </p>
                {hoursOverTarget >= 1 && <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">{t.keepPushing}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <h3 className="text-xl font-black text-foreground mt-8 tracking-tight">
            {preset?.name || activeFast.presetId}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] mt-1 opacity-60">
            {activeFast.targetHours}{t.hours} {t.fastLabel}
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs px-2">
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => navigateTo("presets")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary-foreground px-4 py-4 font-bold text-sm transition-all hover:bg-secondary/80 active:scale-95 shadow-sm"
            >
              <SettingsIcon className="h-4 w-4" />
              {t.changePreset}
            </button>
            <button
              onClick={handleEndFast}
              className={`flex-[2] py-4 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95 ${isComplete
                  ? "bg-primary text-primary-foreground shadow-primary/20"
                  : "bg-secondary text-secondary-foreground"
                }`}
            >
              {t.endFast}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="h-14 w-14 flex items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="max-w-[320px] rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">{t.confirmDeleteTitle}</AlertDialogTitle>
              <AlertDialogDescription className="text-center mt-2">
                {t.confirmDeleteText}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3 sm:flex-row sm:justify-center mt-4">
              <AlertDialogAction
                onClick={handleDiscardFast}
                className="flex-1 rounded-2xl bg-destructive text-white hover:bg-destructive/90"
              >
                {t.delete}
              </AlertDialogAction>
              <AlertDialogCancel className="flex-1 rounded-2xl bg-secondary border-none m-0">
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
      <div className="flex flex-col h-full overflow-hidden px-1">
        <PresetGrid onSelect={handleSelectPreset} />

        <div className="mt-8 flex flex-col gap-4">
          {lastFastInfo && !activeFast && (
            <div className="px-2 pb-6">
              <button
                onClick={handleQuickStart}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-5 font-black text-primary-foreground shadow-2xl shadow-primary/20 active:scale-95 transition-all text-lg"
              >
                <Clock className="h-6 w-6" />
                {t.quickStart} ({getPresetById(lastFastInfo.presetId)?.name || lastFastInfo.presetId})
              </button>
            </div>
          )}

          {activeFast && (
            <div className="px-2 pb-10">
              <button
                onClick={() => navigateTo("timer")}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-secondary font-bold text-sm text-foreground active:scale-95 transition-all border border-border/50 shadow-lg"
              >
                <Timer className="h-5 w-5" />
                {t.backToTimer}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDetailContent = () => (
    <div className="flex flex-col h-full overflow-hidden px-1">
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
          className="absolute inset-0 flex flex-col pt-2"
        >
          <div className="flex-1 flex flex-col h-full">
            {viewState === "timer" && renderTimerContent()}
            {viewState === "presets" && renderPresetsContent()}
            {viewState === "detail" && renderDetailContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
