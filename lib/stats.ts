import { startOfDay, subDays, isSameDay } from "date-fns"
import { type FastingRecord } from "./storage"

export interface StreakStats {
  currentStreak: number
  longestStreak: number
}

/**
 * Calculates current and longest streaks based on completed fasts.
 * A streak is defined as consecutive calendar days with at least one completed fast.
 */
export function calculateStreaks(history: FastingRecord[]): StreakStats {
  if (history.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Filter for completed fasts and get unique calendar days (start of day)
  const completedDays = Array.from(
    new Set(
      history
        .filter((r) => r.completed && r.endTime)
        .map((r) => startOfDay(new Date(r.startTime)).getTime())
    )
  ).sort((a, b) => b - a) // Sort descending (most recent first)

  if (completedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = startOfDay(new Date()).getTime()
  const yesterday = subDays(today, 1).getTime()

  // 1. Calculate Current Streak
  // Streak is alive if there's a fast today OR yesterday
  const lastFastDay = completedDays[0]
  if (lastFastDay === today || lastFastDay === yesterday) {
    let checkDay = lastFastDay
    let idx = 0
    
    while (idx < completedDays.length && completedDays[idx] === checkDay) {
      currentStreak++
      checkDay = subDays(checkDay, 1).getTime()
      idx++
    }
  }

  // 2. Calculate Longest Streak
  if (completedDays.length > 0) {
    tempStreak = 1
    longestStreak = 1
    for (let i = 1; i < completedDays.length; i++) {
      const prevDay = subDays(completedDays[i - 1], 1).getTime()
      if (completedDays[i] === prevDay) {
        tempStreak++
      } else {
        tempStreak = 1
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    }
  }

  return { currentStreak, longestStreak }
}
