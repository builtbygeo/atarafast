import { FastingRecord } from "./storage"
import { calculateStreaks } from "./stats"

export type ChallengeCategory = "streak" | "duration" | "milestone"

export interface ChallengeDef {
  id: string
  category: ChallengeCategory
  target: number
  // Translation keys for rendering
  titleKey: string
  descKey: string
}

export interface ChallengeProgress extends ChallengeDef {
  currentProgress: number
  isUnlocked: boolean
}

export const CHALLENGES: ChallengeDef[] = [
  // Streaks
  { id: "streak_3", category: "streak", target: 3, titleKey: "challenge_streak_3", descKey: "challenge_streak_desc" },
  { id: "streak_5", category: "streak", target: 5, titleKey: "challenge_streak_5", descKey: "challenge_streak_desc" },
  { id: "streak_7", category: "streak", target: 7, titleKey: "challenge_streak_7", descKey: "challenge_streak_desc" },
  { id: "streak_14", category: "streak", target: 14, titleKey: "challenge_streak_14", descKey: "challenge_streak_desc" },
  { id: "streak_30", category: "streak", target: 30, titleKey: "challenge_streak_30", descKey: "challenge_streak_desc" },

  // Durations
  { id: "duration_24", category: "duration", target: 24, titleKey: "challenge_duration_24", descKey: "challenge_duration_desc" },
  { id: "duration_36", category: "duration", target: 36, titleKey: "challenge_duration_36", descKey: "challenge_duration_desc" },
  { id: "duration_48", category: "duration", target: 48, titleKey: "challenge_duration_48", descKey: "challenge_duration_desc" },
  { id: "duration_72", category: "duration", target: 72, titleKey: "challenge_duration_72", descKey: "challenge_duration_desc" },
  { id: "duration_96", category: "duration", target: 96, titleKey: "challenge_duration_96", descKey: "challenge_duration_desc" },

  // Milestones
  { id: "milestone_10", category: "milestone", target: 10, titleKey: "challenge_milestone_10", descKey: "challenge_milestone_desc" },
  { id: "milestone_50", category: "milestone", target: 50, titleKey: "challenge_milestone_50", descKey: "challenge_milestone_desc" },
  { id: "milestone_100", category: "milestone", target: 100, titleKey: "challenge_milestone_100", descKey: "challenge_milestone_desc" },
]

export function calculateChallenges(history: FastingRecord[]): ChallengeProgress[] {
  const completedFasts = history.filter((r) => r.completed && r.endTime)
  const { longestStreak } = calculateStreaks(history)
  const totalCompleted = completedFasts.length

  // Calculate longest fast duration completed
  let maxDurationHours = 0
  for (const fast of completedFasts) {
    const elapsedHrs = (new Date(fast.endTime!).getTime() - new Date(fast.startTime).getTime()) / 3600000
    if (elapsedHrs > maxDurationHours) {
      maxDurationHours = Math.floor(elapsedHrs)
    }
  }

  return CHALLENGES.map((def) => {
    let currentProgress = 0

    switch (def.category) {
      case "streak":
        currentProgress = longestStreak
        break
      case "duration":
        currentProgress = maxDurationHours
        break
      case "milestone":
        currentProgress = totalCompleted
        break
    }

    // Cap progress at the target for display purposes, unless it's a binary duration unlock.
    // For duration, it's either unlocked (1) or not (0), but we can just use the exact hours.
    
    const isUnlocked = currentProgress >= def.target
    const clampedProgress = Math.min(currentProgress, def.target)

    return {
      ...def,
      currentProgress: clampedProgress,
      isUnlocked,
    }
  })
}
