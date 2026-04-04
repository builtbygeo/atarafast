import { FastingRecord } from "./storage"
import { differenceInCalendarDays } from "date-fns"

export interface FastingProgram {
  id: string
  titleKey: string
  descKey: string
  minHours: number 
  targetDays: number 
  type: "consecutive" | "single"
  difficulty: "beginner" | "intermediate" | "advanced" | "elite"
}

export interface ActiveProgramState {
  id: string
  startDate: string
  progressDays: number
  lastSuccessDate: string | null
}

export const PROGRAMS: FastingProgram[] = [
  { id: "prog_3d_14", titleKey: "prog_3d_14_title", descKey: "prog_3d_14_desc", minHours: 14, targetDays: 3, type: "consecutive", difficulty: "beginner" },
  { id: "prog_7d_16", titleKey: "prog_7d_16_title", descKey: "prog_7d_16_desc", minHours: 16, targetDays: 7, type: "consecutive", difficulty: "intermediate" },
  { id: "prog_14d_18", titleKey: "prog_14d_18_title", descKey: "prog_14d_18_desc", minHours: 18, targetDays: 14, type: "consecutive", difficulty: "advanced" },
  { id: "prog_7d_20", titleKey: "prog_7d_20_title", descKey: "prog_7d_20_desc", minHours: 20, targetDays: 7, type: "consecutive", difficulty: "elite" },
  { id: "prog_36h", titleKey: "prog_36h_title", descKey: "prog_36h_desc", minHours: 36, targetDays: 1, type: "single", difficulty: "advanced" },
  { id: "prog_48h", titleKey: "prog_48h_title", descKey: "prog_48h_desc", minHours: 48, targetDays: 1, type: "single", difficulty: "elite" }
]

export function getProgramById(id: string): FastingProgram | undefined {
  return PROGRAMS.find(p => p.id === id)
}

/**
 * Evaluates a newly completed fast against the currently active program.
 * Validates consecutive rules or single-pass wins.
 */
export function evaluateProgram(
  program: FastingProgram,
  state: ActiveProgramState,
  record: FastingRecord
): { status: "win" | "continue" | "fail" | "ignore", newState?: ActiveProgramState } {
  // If the fast was abandoned or target unmet
  if (!record.completed || !record.endTime) {
    return { status: "ignore" } // Abandoned fasts don't break streaks immediately, they're just ignored.
  }

  const hoursElapsed = (new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 3600000
  if (hoursElapsed < program.minHours) {
    // They completed a fast but it wasn't long enough.
    // If it's a consecutive challenge, they technically didn't pass today.
    // However, if they still have time today to do another fast, we could 'ignore' it.
    // To be strictly rigorous: A consecutive day must have at least one qualifying fast.
    return { status: "ignore" } 
  }

  // They successfully met the hours requirement!
  const recordEnd = new Date(record.endTime)

  if (program.type === "single") {
    return { status: "win" }
  }

  if (program.type === "consecutive") {
    if (!state.lastSuccessDate) {
      // Very first success!
      const newProgress = 1
      if (newProgress >= program.targetDays) return { status: "win" }
      
      return { 
        status: "continue", 
        newState: { ...state, progressDays: newProgress, lastSuccessDate: recordEnd.toISOString() } 
      }
    }

    const lastEnd = new Date(state.lastSuccessDate)
    const diffDays = differenceInCalendarDays(recordEnd, lastEnd)

    if (diffDays === 0) {
      // They already completed a qualifying fast today. 
      // Progress doesn't increment twice in one calendar day for 'consecutive day' challenges.
      return { status: "ignore" }
    } else if (diffDays === 1) {
      // Perfect consecutive day!
      const newProgress = state.progressDays + 1
      if (newProgress >= program.targetDays) return { status: "win" }

      return {
        status: "continue",
        newState: { ...state, progressDays: newProgress, lastSuccessDate: recordEnd.toISOString() }
      }
    } else {
      // They missed a day. Streak broken. Back to 1 since they succeeded today.
      const newProgress = 1
      if (program.targetDays === 1) return { status: "win" } // Just in case, though targetDays > 1 for consecutive

      return {
        status: "fail", // The old run failed, starting a new one gracefully
        newState: { ...state, progressDays: newProgress, lastSuccessDate: recordEnd.toISOString() }
      }
    }
  }

  return { status: "ignore" }
}
