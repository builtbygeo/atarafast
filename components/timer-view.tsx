"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
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
  Repeat,
  Edit2,
  Settings as SettingsIcon,
  BookOpen,
  Flame,
  Share2,
} from "lucide-react"
import { ShareDialog } from "@/components/share-dialog"
import { CompletionAnimation } from "@/components/completion-animation"
import { Logo } from "@/components/logo"
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
  onFastEnd?: (record: FastingRecord) => void
  onNavigateToHistory?: () => void
}

const haptic = (vibration = [50]) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(vibration)
  }
}

export function TimerView({ history, onFastEnd, onNavigateToHistory }: TimerViewProps) {
  const { t, lang } = useLang()
  const { sendNotification } = useNotifications()
  const [activeFast, setActiveFast] = useState<FastingRecord | null>(null)
  const [viewState, setViewState] = useState<ViewState>("presets")
  const [direction, setDirection] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState<FastingPreset | null>(null)
  const [now, setNow] = useState(new Date())
  const [settings, setSettings] = useState<ReturnType<typeof getSettings>>({ 
    timerDirection: "down", 
    timerStyle: "circle",
    notificationsEnabled: false,
    journalEnabled: false
  })
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditStartTime, setShowEditStartTime] = useState(false)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [showLateGreeting, setShowLateGreeting] = useState(false)
  const hasCelebratedRef = useRef(false)

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
    if (fast) {
      setViewState("timer")
      const start = new Date(fast.startTime)
      const targetMs = fast.targetHours * 3600000
      const elapsedMs = new Date().getTime() - start.getTime()
      if (elapsedMs >= targetMs) {
        if (!hasCelebratedRef.current) {
          hasCelebratedRef.current = true
          const isLateReturn = (elapsedMs - targetMs) > 60000
          if (isLateReturn) {
            setShowLateGreeting(true)
          } else {
            sendNotification(t.targetReached, {
              body: `${fast.presetId} fast complete!`,
            })
          }
        }
      } else {
        hasCelebratedRef.current = false
      }
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!activeFast) return
    const interval = setInterval(() => {
      const currentNow = new Date()
      setNow(currentNow)

      const start = new Date(activeFast.startTime)
      const targetMs = activeFast.targetHours * 3600000
      const elapsedMs = currentNow.getTime() - start.getTime()

      if (elapsedMs >= targetMs && !hasCelebratedRef.current) {
        hasCelebratedRef.current = true
        const isLateReturn = (elapsedMs - targetMs) > 60000
        if (isLateReturn) {
          setShowLateGreeting(true)
        } else {
          sendNotification(t.targetReached, {
            body: `${activeFast.presetId} fast complete!`,
          })
        }
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

  const performEndFast = useCallback(() => {
    if (!activeFast) return

    const start = new Date(activeFast.startTime)
    const targetMs = activeFast.targetHours * 3600000
    const elapsedMs = new Date().getTime() - start.getTime()
    const isSuccess = elapsedMs >= targetMs

    if (isSuccess) {
      setJustCompleted(true)
      haptic([50, 50, 100])
      // Immediate transition - no delay
      const record = endFast()
      if (record) {
        setActiveFast(null)
        setConfirmEnd(false)
        // Keep celebration visible briefly then transition
        setTimeout(() => {
          setJustCompleted(false)
          navigateTo("presets")
          onFastEnd?.(record)
        }, 1500) // Brief celebration to show user something happened
      }
    } else {
      const record = endFast()
      if (record) {
        setActiveFast(null)
        setConfirmEnd(false)
        navigateTo("presets")
        onFastEnd?.(record)
      }
    }
  }, [onFastEnd, navigateTo, activeFast])

  const handleEndFast = useCallback(() => {
    if (!activeFast) return

    if (!confirmEnd) {
      setConfirmEnd(true)
      haptic([30])
      // Reset after 2 seconds if not confirmed
      setTimeout(() => setConfirmEnd(false), 2000)
      return
    }

    performEndFast()
  }, [confirmEnd, activeFast, performEndFast])

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
    const percentage = settings.timerDirection === "down" && !isComplete
      ? Math.max(0, Math.floor((remainingMs / targetMs) * 100))
      : Math.min(100, Math.floor((elapsedMs / targetMs) * 100))

    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const isYesterday = startTime.getDate() !== now.getDate()
    const dayText = isYesterday ? (t.yesterday || "Yesterday") : (t.today || "Today")
    const hoursOverTarget = isComplete ? Math.round(((elapsedMs - targetMs) / 3600000) * 2) / 2 : 0
    const goalTime = addHours(startTime, activeFast.targetHours)

    return (
      <div className="flex flex-col items-center h-full pt-2 pb-44 overflow-y-auto w-full px-4 no-scrollbar [touch-action:pan-y]">
        <WeekStatusStrip history={history} activeFast={activeFast} />

        <div className="flex flex-col items-center text-center mt-4 mb-6 w-full relative">
          {justCompleted && <CompletionAnimation />}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
            {settings.timerStyle === "triangle" ? (
              <TriangularProgress
                elapsedHours={elapsedMs / 3600000}
                targetHours={activeFast.targetHours}
                size={380}
                strokeWidth={32}
              >
                <div className="flex flex-col items-center justify-center -mt-4">
                  <Logo className="w-24 text-foreground mb-4 opacity-70" />
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
                size={320}
                strokeWidth={22}
              >
                <div className="flex flex-col items-center justify-center -mt-2">
                  <Logo className="w-28 text-foreground mb-5 opacity-90" />
                  <span className="text-[40px] font-black text-foreground font-mono tabular-nums tracking-tighter leading-none relative z-10 w-full text-center">
                    {formatTime(settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs)}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-80">
                    {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
                  </span>
                </div>
              </CircularProgress>
            )}
          </motion.div>

          <div className="flex gap-4 mt-8 w-full max-w-[320px] px-2 relative z-20">
            {/* STARTS CARD */}
            <button
              onClick={() => setShowEditStartTime(true)}
              className="flex-1 rounded-[1.25rem] p-4 pb-3.5 border border-primary/40 bg-primary/5 dark:bg-primary/10 flex flex-col pt-3 shadow-[0_4px_20px_-10px_rgba(34,197,94,0.2)] cursor-pointer hover:bg-primary/10 transition-colors text-left"
            >
              <div className="flex justify-between items-center mb-1 w-full">
                <span className="block text-[10px] font-black text-primary uppercase tracking-widest">{t.startTime || "STARTS"}</span>
                <Edit2 className="h-3 w-3 text-primary opacity-50" />
              </div>
              <span className="block text-2xl font-black text-foreground mb-0.5 tracking-tighter leading-none">
                {format(startTime, "h:mm a")}
              </span>
              <span className="block text-xs font-semibold text-muted-foreground mt-1">{dayText}</span>
            </button>

            {/* GOAL CARD */}
            <button
              onClick={() => navigateTo("presets")}
              className="flex-1 rounded-[1.25rem] p-4 pb-3.5 border border-border bg-secondary/20 dark:bg-secondary/30 flex flex-col pt-3 cursor-pointer hover:bg-secondary/40 transition-colors text-left shadow-sm"
            >
              <div className="flex justify-between items-center mb-1 w-full">
                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.goal || "GOAL"}</span>
                <Edit2 className="h-3 w-3 text-muted-foreground opacity-50" />
              </div>
              <span className="block text-2xl font-black text-foreground mb-0.5 tracking-tighter leading-none">
                {format(goalTime, "h:mm a")}
              </span>
              <span className="block text-xs font-semibold text-muted-foreground mt-1">
                {isComplete ? (t.fastComplete || "Fast Complete") : (lang === 'bg' ? 'В прогрес' : 'In Progress')}
              </span>
            </button>
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <p className="text-[11px] font-black text-primary uppercase tracking-tight">
                {hoursOverTarget < 1 ? t.targetReached : t.overTarget.replace("{{hours}}", hoursOverTarget.toString())}
              </p>
            </motion.div>
          )}


        </div>

        <div className="flex flex-col w-full gap-4 max-w-[320px] mt-auto pb-8 relative z-20">
          <button
            onClick={handleEndFast}
            className={`w-full py-4 rounded-[2rem] font-black text-[15px] tracking-widest transition-all active:scale-95 border ${confirmEnd
              ? "bg-destructive border-destructive text-white shadow-[0_0_30px_-5px_var(--destructive)]"
              : "bg-primary/20 border-primary/50 text-primary uppercase shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)] hover:bg-primary/30"
              }`}
          >
            {confirmEnd ? t.confirmEndFast : (t.completeFast || "COMPLETE FAST")}
            {confirmEnd && <span className="block text-[10px] mt-1 opacity-70 normal-case tracking-normal font-medium">{t.tapToConfirm}</span>}
          </button>
          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-secondary/80 px-8 py-3.5 text-sm font-black text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-secondary active:scale-95 border border-border/50 uppercase tracking-widest"
          >
            <Share2 className="h-4 w-4" />
            {t.shareStories || "Сподели в Stories"}
          </button>
        </div>

        {showShare && (
          <ShareDialog
            type="active"
            elapsedMs={elapsedMs}
            targetHours={activeFast.targetHours}
            presetId={activeFast.presetId}
            percentage={Math.min(100, Math.floor((elapsedMs / (activeFast.targetHours * 3600000)) * 100))}
            onClose={() => setShowShare(false)}
          />
        )}

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
    const lastCompleted = history.filter(h => h.completed).sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())[0]
    const isNewUser = history.length === 0

    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-4 pb-44 no-scrollbar [touch-action:pan-y]">
        <WeekStatusStrip history={history} activeFast={null} />

        {/* New user onboarding nudge */}
        {isNewUser && (
          <div className="mt-4 mb-2 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-4 shadow-[0_0_20px_-10px_rgba(34,197,94,0.2)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{t.welcomeTitle || "Добре дошли!"}</p>
              <p className="text-xs text-foreground/80 font-semibold leading-relaxed">
                {t.welcomeHint || "Изберете план по-долу и прочетете за различните протоколи за гладуване."}
              </p>
            </div>
          </div>
        )}


        <div className="mt-6">
          <PresetGrid onSelect={handleSelectPreset} />
        </div>

        <div className="mt-10 mb-12">
          {lastFastInfo && !activeFast && (
            <button
              onClick={handleQuickStart}
              className="w-full flex items-center justify-center gap-3 sm:gap-4 rounded-[2rem] bg-primary p-5 sm:p-7 font-black text-primary-foreground shadow-2xl shadow-primary/40 active:scale-[0.97] transition-all"
            >
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-80 whitespace-nowrap pt-0.5">
                  {t.quickStart}
                </span>
                <span className="text-xl sm:text-3xl font-black tabular-nums tracking-tighter">
                  {getPresetById(lastFastInfo.presetId)?.name || lastFastInfo.presetId}
                </span>
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
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 pb-44 no-scrollbar [touch-action:pan-y]">
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
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={viewState}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col pt-0 will-change-transform"
        >
          {viewState === "timer" && renderTimerContent()}
          {viewState === "presets" && renderPresetsContent()}
          {viewState === "detail" && renderDetailContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
