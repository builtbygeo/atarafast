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
  
  // LOGGING FOR DEBUGGING
  console.log("checkAiQuota: usage:", usage, "isPremium:", isPremium);

  // If NOT premium, let's allow 1 per day instead of 1 per month as requested
  if (!isPremium) {
    if (usage.lastUsedDate) {
        const last = new Date(usage.lastUsedDate);
        const isToday =
          last.getDate() === now.getDate() &&
          last.getMonth() === now.getMonth() &&
          last.getFullYear() === now.getFullYear();

        if (isToday) {
            return { canUse: false, reason: "Daily limit reached", remaining: 0 };
        }
    }
    return { canUse: true, remaining: 1 };
  } else {
    // Premium: unlimited or higher? User said "one per day for everyone"
    // Let's unify to 1 per day for everyone for now.
    if (usage.lastUsedDate) {
      const last = new Date(usage.lastUsedDate);
      const isToday =
        last.getDate() === now.getDate() &&
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear();

      if (isToday) {
        return { canUse: false, reason: "Daily limit reached", remaining: 0 };
      }
    }
    return { canUse: true, remaining: 1 };
  }
}
