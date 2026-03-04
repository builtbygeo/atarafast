"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgress } from "@/components/circular-progress"
import { TriangularProgress } from "@/components/triangular-progress"
import { PresetGrid } from "@/components/preset-grid"
import { PresetDetail } from "@/components/preset-detail"
import { WeekStatusStrip } from "@/components/week-status-strip"
import {
  Trash2,
  Clock,
  Timer,
  Settings as SettingsIcon,
  Edit2,
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
  updateActiveFastStartTime,
  type FastingRecord,
} from "@/lib/storage"
import { getPresetById, type FastingPreset } from "@/lib/presets"
import { EditTimeDialog } from "@/components/edit-time-dialog"
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
  const [settings, setSettings] = useState<ReturnType<typeof getSettings>>({ timerDirection: "down", timerStyle: "circle" })
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditStartTime, setShowEditStartTime] = useState(false)
  const [confirmEnd, setConfirmEnd] = useState(false)

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
    if (!confirmEnd) {
      setConfirmEnd(true)
      haptic([30])
      // Reset after 3 seconds if not confirmed
      setTimeout(() => setConfirmEnd(false), 3000)
      return
    }

    const record = endFast()
    if (record) {
      setActiveFast(null)
      setConfirmEnd(false)
      navigateTo("presets")
      onFastEnd?.()
    }
  }, [onFastEnd, navigateTo, confirmEnd])

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

  const handleUpdateStartTime = (newStartTime: Date) => {
    updateActiveFastStartTime(newStartTime)
    setActiveFast(getActiveFast())
    setShowEditStartTime(false)
  }

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
      <div className="flex flex-col items-center h-full pt-2 pb-6 overflow-y-auto w-full px-4 no-scrollbar">
        <WeekStatusStrip history={history} activeFast={activeFast} />

        <div className="flex flex-col items-center text-center mt-4 mb-6 w-full">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            {settings.timerStyle === "triangle" ? (
              <TriangularProgress
                elapsedHours={elapsedMs / 3600000}
                targetHours={activeFast.targetHours}
                size={340}
                strokeWidth={28}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-foreground font-mono tabular-nums tracking-tighter leading-none relative z-10 w-full text-center">
                    {formatTime(settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs)}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground mt-3 uppercase tracking-[0.2em] opacity-80">
                    {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
                  </span>
                </div>
              </TriangularProgress>
            ) : (
              <CircularProgress
                progress={percentage / 100}
                elapsedHours={elapsedMs / 3600000}
                targetHours={activeFast.targetHours}
                size={280}
                strokeWidth={28}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-foreground font-mono tabular-nums tracking-tighter leading-none relative z-10 w-full text-center">
                    {formatTime(settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs)}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground mt-3 uppercase tracking-[0.2em] opacity-80">
                    {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
                  </span>
                </div>
              </CircularProgress>
            )}
          </motion.div>

          <div className="flex gap-3 mt-6 w-full max-w-sm px-4">
            <div className="flex-1 bg-gradient-to-br from-secondary/40 to-secondary/10 rounded-2xl p-4 border border-border/60 relative group backdrop-blur-sm shadow-lg shadow-black/5">
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70 mb-1.5">{t.startTime.toUpperCase()}</span>
              <div className="flex items-center justify-between">
                <span className="block text-base font-black text-foreground">{format(startTime, "EEE, HH:mm")}</span>
                <button
                  onClick={() => setShowEditStartTime(true)}
                  className="p-1.5 rounded-lg bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20 backdrop-blur-sm shadow-lg shadow-black/5">
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1.5">{`${activeFast.targetHours}${t.hours} ${t.goal.toUpperCase()}`}</span>
              <span className="block text-base font-black text-foreground">{format(goalTime, "EEE, HH:mm")}</span>
            </div>
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <p className="text-[11px] font-black text-primary uppercase tracking-tight">
                {hoursOverTarget < 1 ? t.targetReached : t.overTarget.replace("{{hours}}", hoursOverTarget.toFixed(1))}
              </p>
            </motion.div>
          )}


        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs mt-auto pb-8">
          <div className="grid grid-cols-[1fr_2fr_auto] gap-3">
            <button onClick={() => navigateTo("presets")} className="flex h-14 items-center justify-center rounded-2xl bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-95 border border-border/50">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndFast}
              className={`h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 px-4 ${confirmEnd
                ? "bg-destructive text-white shadow-destructive/30"
                : (isComplete ? "bg-primary text-primary-foreground shadow-primary/30" : "bg-card text-foreground border border-border")
                }`}
            >
              {confirmEnd ? t.confirmEndFast : t.endFast}
              {confirmEnd && <span className="block text-[8px] mt-1 opacity-70 normal-case tracking-normal font-medium">{t.tapToConfirm}</span>}
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

        {/* Edit Start Time Dialog */}
        {showEditStartTime && (
          <EditTimeDialog
            currentTime={startTime}
            label={t.startTime}
            onConfirm={handleUpdateStartTime}
            onCancel={() => setShowEditStartTime(false)}
          />
        )}
      </div>
    )
  }

  const renderPresetsContent = () => {
    const lastFastInfo = getLastFastInfo()
    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-4 no-scrollbar">
        <WeekStatusStrip history={history} activeFast={null} />

        <div className="mt-8">
          <PresetGrid onSelect={handleSelectPreset} />
        </div>

        <div className="mt-12 mb-12">
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
