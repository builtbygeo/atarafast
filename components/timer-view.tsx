"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { CircularProgress } from "@/components/circular-progress"
import { WeekStrip } from "@/components/week-strip"
import { PresetGrid } from "@/components/preset-grid"
import { PresetDetail } from "@/components/preset-detail"
import { EditTimeDialog } from "@/components/edit-time-dialog"
import {
  getActiveFast,
  startFast,
  endFast,
  deleteFast,
  getHistory,
  getSettings,
  updateActiveFastStartTime,
  updateActiveFastPreset,
  markApath,
  type FastingRecord,
} from "@/lib/storage"
import { getPresetById, type FastingPreset } from "@/lib/presets"
import { Square, Trash2, Clock, Sparkles } from "lucide-react"
import { useLang } from "@/lib/language-context"

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
  const [activeFast, setActiveFast] = useState<FastingRecord | null>(null)
  const [history, setHistory] = useState<FastingRecord[]>([])
  const [viewState, setViewState] = useState<ViewState>("presets")
  const [direction, setDirection] = useState(0) // 1 = slide left, -1 = slide right
  const [selectedPreset, setSelectedPreset] = useState<FastingPreset | null>(null)
  const [now, setNow] = useState(new Date())
  const [settings, setSettings] = useState<ReturnType<typeof getSettings>>({ timerDirection: "down" })
  const [mounted, setMounted] = useState(false)
  const [showEditStartTime, setShowEditStartTime] = useState(false)

  // Navigate view with animation direction logic
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
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [activeFast])

  const handleSelectPreset = useCallback(
    (preset: FastingPreset) => {
      setSelectedPreset(preset)
      navigateTo("detail")
    },
    [navigateTo]
  )

  const handleStartFast = useCallback(
    (hours: number) => {
      if (!selectedPreset) return
      const record = startFast(selectedPreset.id, hours)
      setActiveFast(record)
      navigateTo("timer")
      setNow(new Date())
      haptic([50, 50, 50])
    },
    [selectedPreset, navigateTo]
  )

  const handleUpdateFast = useCallback(
    (hours: number) => {
      if (!selectedPreset) return
      updateActiveFastPreset(selectedPreset.id, hours)
      const updatedFast = getActiveFast()
      setActiveFast(updatedFast)
      navigateTo("timer")
      setNow(new Date())
      haptic([50, 50, 50])
    },
    [selectedPreset, navigateTo]
  )

  const handleEndFast = useCallback(() => {
    const record = endFast()
    if (record) {
      setHistory((prev) => [...prev, record])
    }
    setActiveFast(null)
    navigateTo("presets")
    onFastEnd?.()
    haptic([100])
  }, [onFastEnd, navigateTo])

  const handleDeleteFast = useCallback(() => {
    deleteFast()
    setActiveFast(null)
    navigateTo("presets")
    haptic([50, 50])
  }, [navigateTo])

  const handleEditStartTime = useCallback((newTime: Date) => {
    updateActiveFastStartTime(newTime)
    const updatedFast = getActiveFast()
    setActiveFast(updatedFast)
    setShowEditStartTime(false)
    setNow(new Date())
    haptic([30])
  }, [])

  const handleMarkApath = useCallback(() => {
    markApath()
    const updatedFast = getActiveFast()
    setActiveFast(updatedFast)
    haptic([100, 50, 100])
  }, [])

  // Swipe logic handlers
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const { offset, velocity } = info
    const isHorizontalSwipe = Math.abs(offset.x) > swipeThreshold && Math.abs(velocity.x) > 200

    if (isHorizontalSwipe) {
      if (offset.x > 0) {
        // Swipe right -> Go left in hierarchy
        if (viewState === "detail") navigateTo("presets")
        else if (viewState === "presets" && activeFast) navigateTo("timer")
      } else {
        // Swipe left -> Go right in hierarchy
        if (viewState === "timer") navigateTo("presets")
      }
    }
  }

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "10%" : "-10%",
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "10%" : "-10%",
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  // Active timer view calculations
  const renderTimerContent = () => {
    if (!activeFast) return null
    const start = new Date(activeFast.startTime)
    const targetMs = activeFast.targetHours * 60 * 60 * 1000
    const elapsedMs = now.getTime() - start.getTime()
    const remainingMs = Math.max(0, targetMs - elapsedMs)
    const progress = Math.max(0, Math.min(elapsedMs / targetMs, 1))
    const isComplete = elapsedMs >= targetMs
    const preset = getPresetById(activeFast.presetId)

    const displayMs = settings.timerDirection === "down" && !isComplete ? remainingMs : elapsedMs
    const totalSeconds = Math.floor(displayMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, "0")

    const percentage = Math.round(progress * 100)
    const hoursElapsed = elapsedMs / (1000 * 60 * 60)
    const hoursOverTarget = Math.max(0, hoursElapsed - activeFast.targetHours)

    // Body States logic (Ketosis > 12h, Autophagy > 16h)
    let bodyState = ""
    if (hoursElapsed >= 16) bodyState = "🔥 Autophagy Phase" // In bulgarian: Автофагия фаза
    else if (hoursElapsed >= 12) bodyState = "⚡ Ketosis (Fat Burn)" // Кетоза (Изгаряне на мазнини)
    else if (hoursElapsed >= 8) bodyState = "📉 Lowered Blood Sugar" // Понижена кръвна захар

    return (
      <div className="flex-1 flex flex-col items-center px-5 py-6 gap-6 w-full h-full">
        <WeekStrip history={history} />

        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {/* Framer motion wrapper for subtle hover/pulse effects */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
          >
            {/* Subtle glow behind progress circle when active */}
            {!isComplete && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-20"
                style={{ backgroundColor: preset?.color }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <CircularProgress
              progress={progress}
              size={240}
              strokeWidth={10}
              color={isComplete ? "oklch(0.65 0.17 160)" : preset?.color}
            >
              <span className="text-4xl font-bold font-mono text-foreground tabular-nums tracking-tight">
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                {isComplete ? t.elapsed : settings.timerDirection === "down" ? t.remaining : t.elapsed} ({percentage}%)
              </span>
            </CircularProgress>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {bodyState && !isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm font-medium text-muted-foreground"
              >
                {bodyState}
              </motion.div>
            )}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mt-2"
              >
                <p className="text-sm font-semibold text-primary">
                  {hoursOverTarget < 1
                    ? t.targetReached
                    : t.overTarget.replace("{{hours}}", hoursOverTarget.toFixed(1))}
                </p>
                {hoursOverTarget >= 1 && <p className="text-xs text-muted-foreground mt-1">{t.keepPushing}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-muted-foreground mt-2">
            {preset?.name || "Персонален"} {t.fast} &middot; {activeFast.targetHours}
            {t.hours} {t.goal}
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 max-w-xs">
          {!activeFast.apathTime && elapsedMs > 3600000 && (
            <button
              onClick={handleMarkApath}
              className="flex items-center justify-center gap-2 rounded-xl bg-card border border-primary/20 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              {t.markApath}
            </button>
          )}

          <AnimatePresence>
            {activeFast.apathTime && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 overflow-hidden"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t.apathReached}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <button
              onClick={handleDeleteFast}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground active:scale-90"
              aria-label="Discard fast"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            {/* Long Press behavior conceptually replaced by active:scale which forces intentional press */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleEndFast}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Square className="h-4 w-4" />
              {t.endFast}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {activeFast.apathTime && (
            <p className="text-xs text-muted-foreground">
              {t.apathMarked.replace(
                "{{time}}",
                new Date(activeFast.apathTime).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
              )}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditStartTime(true)}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors flex items-center gap-1 p-2"
            >
              <Clock className="h-3 w-3" />
              {t.editStartTime}
            </button>
            <button
              onClick={() => {
                setSelectedPreset(preset || null)
                navigateTo("detail")
              }}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors p-2"
            >
              {t.viewDetails}
            </button>
          </div>
        </div>

        {showEditStartTime && activeFast && (
          <EditTimeDialog
            currentTime={new Date(activeFast.startTime)}
            label={t.editStartTime}
            onConfirm={handleEditStartTime}
            onCancel={() => setShowEditStartTime(false)}
          />
        )}
      </div>
    )
  }

  const renderPresetsContent = () => (
    <div className="flex-1 overflow-y-auto px-5 py-6 w-full h-full">
      <div className="mb-6">
        <WeekStrip history={history} />
      </div>
      <PresetGrid onSelect={handleSelectPreset} />
    </div>
  )

  const renderDetailContent = () => {
    if (!selectedPreset) return null
    const isCurrentActivePreset = activeFast?.presetId === selectedPreset.id
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6 w-full h-full">
        <PresetDetail
          preset={selectedPreset}
          isActive={!!activeFast}
          isCurrentActivePreset={isCurrentActivePreset}
          onBack={() => navigateTo(activeFast ? "timer" : "presets")}
          onStart={handleStartFast}
          onChangePreset={() => navigateTo("presets")}
          onUpdateFast={handleUpdateFast}
        />
      </div>
    )
  }

  return (
    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
      <motion.div
        key={viewState}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          filter: { duration: 0.2 },
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex-1 w-full h-full absolute inset-0 pt-env-top pb-env-bottom overflow-hidden flex flex-col"
      >
        {viewState === "timer" && renderTimerContent()}
        {viewState === "presets" && renderPresetsContent()}
        {viewState === "detail" && renderDetailContent()}
      </motion.div>
    </AnimatePresence>
  )
}
