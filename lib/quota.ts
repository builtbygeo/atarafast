import { getHistory, getAiUsage, type AiUsage, type FastingRecord } from './storage';

export function getFastCount(): number {
  return getHistory().filter(record => record.completed).length;
}

export function getCompletedFastCount(): number {
    return getHistory().filter(record => record.completed).length;
}

export interface QuotaResult {
  canUse: boolean;
  reason?: string;
  remaining?: number;
}

export function checkAiQuota(isPremium: boolean): QuotaResult {
  const usage = getAiUsage();
  const now = new Date();

  if (!isPremium) {
    if (usage.monthlyCount >= 1) {
      return { canUse: false, reason: "Monthly limit reached (1/mo for Free plan)", remaining: 0 };
    }
    return { canUse: true, remaining: 1 - usage.monthlyCount };
  } else {
    // Premium: 1 per day
    // FIX: Using Date().toISOString() format check or just comparing full dates
    if (usage.lastUsedDate) {
      const last = new Date(usage.lastUsedDate);
      const now = new Date();
      
      const isToday =
        last.getDate() === now.getDate() &&
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear();

      if (isToday) {
        return { canUse: false, reason: "Daily limit reached (Atara)", remaining: 0 };
      }
    }
    return { canUse: true, remaining: 1 };
  }
}
