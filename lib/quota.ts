import { getHistory, getAiUsage } from './storage.ts';

export function getFastCount(): number {
  return getHistory().filter(record => record.completed).length;
}

export interface QuotaResult {
  canUse: boolean;
  reason?: string;
}

/**
 * Checks if AI usage is permitted.
 * Rules:
 * - AI usage requires 5 completed fasts.
 * - Free users: limited to 1 AI usage per day (total limit).
 * - Premium users: unlimited daily usage (placeholder rule, need to adjust if daily limit applies).
 *   Actually the task says: "limited to 1 AI usage per day (unless user is premium)".
 *   Wait, "1/day" is for everyone? Or "1/day" is the limit for free, and premium is more?
 *   Task plan says: "checkAiQuota accurately returns false if usageToday >= 1 (unless user is premium)."
 */
export function checkAiQuota(isPremium: boolean, fastCount: number, usageToday: number): QuotaResult {
  if (fastCount < 5) {
    return { canUse: false, reason: "You need 5 completed fasts to unlock AI features." };
  }

  if (!isPremium && usageToday >= 1) {
    return { canUse: false, reason: "Daily limit reached. Upgrade to Premium for more." };
  }

  return { canUse: true };
}
