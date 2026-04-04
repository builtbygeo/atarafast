"use client"

import { useState, useEffect } from "react"
import { PROGRAMS, type FastingProgram, type ActiveProgramState } from "@/lib/programs"
import { getActiveProgram, getProgramBadges, joinProgram, quitProgram } from "@/lib/storage"
import { useLang } from "@/lib/language-context"
import { Play, CheckCircle2, Lock, Flame, Trophy, Trash2 } from "lucide-react"

export function ProgramsGrid() {
  const { t } = useLang()
  const [activeProg, setActiveProg] = useState<ActiveProgramState | null>(null)
  const [badges, setBadges] = useState<Record<string, number>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setActiveProg(getActiveProgram())
    setBadges(getProgramBadges())
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleJoin = (id: string) => {
    // If they already have an active program, we could throw a confirmation, 
    // but for simplicity we directly replace it.
    const newProg = joinProgram(id)
    setActiveProg(newProg)
  }

  const handleQuit = () => {
    quitProgram()
    setActiveProg(null)
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Flame className="h-5 w-5 text-primary" />
        <h3 className="text-[17px] font-bold text-foreground tracking-tight">{t?.programsTitle || "Active Challenges"}</h3>
      </div>

      <div className="flex flex-col gap-4">
        {PROGRAMS.map((program) => {
          const isActive = activeProg?.id === program.id
          const timesCompleted = badges[program.id] || 0
          const hasCompletedBefore = timesCompleted > 0

          let statusTheme = "bg-secondary/20 border-border/40"
          if (isActive) statusTheme = "bg-primary/10 border-primary/40 shadow-[0_4px_20px_-10px_rgba(34,197,94,0.3)]"
          else if (hasCompletedBefore) statusTheme = "bg-[#FFF8E7]/5 border-orange-400/20"

          return (
            <div key={program.id} className={`flex flex-col p-5 rounded-[2rem] border ${statusTheme} transition-all relative overflow-hidden group`}>
              {/* x3 Badge */}
              {hasCompletedBefore && (
                <div className="absolute top-4 right-4 flex items-center justify-center bg-orange-500/20 text-orange-500 border border-orange-500/30 font-black text-[10px] px-2 py-1 rounded-full tracking-wider z-10 shadow-sm backdrop-blur-md">
                  x{timesCompleted} {t?.completedBadge || "WON"}
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className="pr-12">
                  <h4 className="text-lg font-black text-foreground tracking-tight mb-1">
                    {String(t?.[program.titleKey as keyof typeof t] || program.titleKey)}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[90%] line-clamp-2">
                    {String(t?.[program.descKey as keyof typeof t] || program.descKey)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5 mt-2">
                <div className="bg-background/80 rounded-xl px-3 py-1.5 flex items-center gap-1.5 border border-border/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">{t?.minHours || "MIN"}</span>
                  <span className="text-sm font-black text-foreground tracking-tighter">{program.minHours}h</span>
                </div>
                <div className="bg-background/80 rounded-xl px-3 py-1.5 flex items-center gap-1.5 border border-border/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">{t?.targetDays || "GOAL"}</span>
                  <span className="text-sm font-black text-foreground tracking-tighter">{program.targetDays} {t?.days || "days"}</span>
                </div>
              </div>

              {isActive ? (
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                      {t?.progress || "Progress"}
                    </span>
                    <span className="text-[10px] font-black text-primary">
                      {activeProg.progressDays} / {program.targetDays}
                    </span>
                  </div>
                  <div className="w-full bg-background/50 rounded-full h-2 mb-4 overflow-hidden border border-border/50">
                    <div 
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${Math.max(5, (activeProg.progressDays / program.targetDays) * 100)}%` }}
                    />
                  </div>
                  <button 
                    onClick={handleQuit}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-destructive/10 text-destructive font-bold text-xs uppercase tracking-widest hover:bg-destructive/20 active:scale-95 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t?.quitChallenge || "Abandon"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleJoin(program.id)}
                  disabled={activeProg !== null}
                  className={`mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
                    activeProg !== null 
                      ? "bg-secondary/50 text-muted-foreground opacity-50 cursor-not-allowed" 
                      : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 uppercase"
                  }`}
                >
                  {activeProg !== null ? (t?.finishActiveFirst || "Finish Active First") : (t?.startChallenge || "Start Challenge")}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
