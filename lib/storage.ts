export interface JournalData {
  energy: number     // 1-5
  mental: number     // 1-5
  sleep: 'Poor' | 'Good' | 'Excellent'
  hydration: '1L' | '2L' | '3L' | '4L+'
  difficult: 0 | 1 | 2 | 3
  hungry: 0 | 1 | 2 | 3
  tags: string[]
  weight?: number
}

export interface FastingRecord {
  id: string
  presetId: string
  startTime: string
  endTime: string | null
  targetHours: number
  completed: boolean
  apathTime?: string 
  notes?: string
  journalData?: JournalData
  weight?: number
}

export interface AiUsage {
  lastResetMonth: number
  lastResetWeek: number
  monthlyCount: number
  weeklyCount: number
  lastUsedDate: string | null
  lastAiReport: string | null
}

export interface AppSettings {
  timerDirection: "up" | "down"
  timerStyle: "circle" | "triangle"
  notificationsEnabled: boolean
  journalEnabled: boolean
  devForcePremium?: boolean
  hasCompletedOnboarding?: boolean
  onboardingRecommendation?: string | null
}

interface StoredData {
  activeFast: FastingRecord | null
  history: FastingRecord[]
  settings: AppSettings
  lastFastInfo: { presetId: string; targetHours: number } | null
  aiUsage: AiUsage
}

const STORAGE_KEY = "fasting-tracker-data"

export const DEFAULT_SETTINGS: AppSettings = {
  timerDirection: "up",
  timerStyle: "circle",
  notificationsEnabled: false,
  journalEnabled: true,
  hasCompletedOnboarding: false,
  onboardingRecommendation: null
}

const DEFAULT_DATA: StoredData = {
  activeFast: null,
  history: [],
  settings: DEFAULT_SETTINGS,
  lastFastInfo: null,
  aiUsage: {
    lastResetMonth: new Date().getMonth(),
    lastResetWeek: Math.floor(new Date().getDate() / 7),
    monthlyCount: 0,
    weeklyCount: 0,
    lastUsedDate: null,
    lastAiReport: null,
  }
}

function loadData(): StoredData {
  if (typeof window === "undefined") return DEFAULT_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_DATA,
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
      aiUsage: { ...DEFAULT_DATA.aiUsage, ...(parsed.aiUsage || {}) }
    }
  } catch {
    return DEFAULT_DATA
  }
}

function saveData(data: StoredData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getActiveFast(): FastingRecord | null {
  return loadData().activeFast
}

export function startFast(presetId: string, targetHours: number): FastingRecord {
  const data = loadData()
  const record: FastingRecord = {
    id: crypto.randomUUID(),
    presetId,
    startTime: new Date().toISOString(),
    endTime: null,
    targetHours,
    completed: false,
  }
  data.activeFast = record
  data.lastFastInfo = { presetId, targetHours }
  saveData(data)
  return record
}

export function updateActiveFast(presetId: string, targetHours: number): FastingRecord | null {
  const data = loadData()
  if (data.activeFast) {
    data.activeFast.presetId = presetId
    data.activeFast.targetHours = targetHours
    data.lastFastInfo = { presetId, targetHours }
    saveData(data)
    return data.activeFast
  }
  return null
}

export function getLastFastInfo(): { presetId: string; targetHours: number } | null {
  return loadData().lastFastInfo
}

export function endFast(): FastingRecord | null {
  const data = loadData()
  if (!data.activeFast) return null
  const now = new Date()
  const start = new Date(data.activeFast.startTime)
  const hoursElapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
  const completed = hoursElapsed >= data.activeFast.targetHours

  const record: FastingRecord = {
    ...data.activeFast,
    endTime: now.toISOString(),
    completed,
  }
  data.history.push(record)
  data.activeFast = null
  saveData(data)
  return record
}

export function deleteFast(): void {
  const data = loadData()
  data.activeFast = null
  saveData(data)
}

export function getHistory(): FastingRecord[] {
  return loadData().history
}

export function deleteHistoryRecord(id: string): void {
  const data = loadData()
  data.history = data.history.filter((r) => r.id !== id)
  saveData(data)
}

export function updateHistoryRecord(id: string, updates: Partial<FastingRecord>): void {
  const data = loadData()
  const index = data.history.findIndex((r) => r.id === id)
  if (index !== -1) {
    data.history[index] = { ...data.history[index], ...updates }
    saveData(data)
  }
}

export function getSettings(): AppSettings {
  return loadData().settings
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const data = loadData()
  data.settings = { ...data.settings, ...updates }
  if (data.settings.notificationsEnabled === undefined) {
    data.settings.notificationsEnabled = true
  }
  if (data.settings.journalEnabled === undefined) {
    data.settings.journalEnabled = true
  }
  saveData(data)
  return data.settings
}

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2)
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StoredData
    if (typeof data !== "object" || data === null) return false
    if (!Array.isArray(data.history)) return false

    saveData(data)
    return true
  } catch {
    return false
  }
}

export function clearAllData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function updateActiveFastStartTime(newStartTime: Date): void {
  const data = loadData()
  if (!data.activeFast) return
  data.activeFast.startTime = newStartTime.toISOString()
  saveData(data)
}

export function updateActiveFastPreset(presetId: string, targetHours: number): void {
  const data = loadData()
  if (!data.activeFast) return
  data.activeFast.presetId = presetId
  data.activeFast.targetHours = targetHours
  saveData(data)
}

export function addManualFast(
  presetId: string,
  startTime: Date,
  endTime: Date,
  targetHours: number
): FastingRecord {
  const data = loadData()
  const hoursElapsed = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  const completed = hoursElapsed >= targetHours

  const record: FastingRecord = {
    id: crypto.randomUUID(),
    presetId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    targetHours,
    completed,
  }
  data.history.push(record)
  saveData(data)
  return record
}

export function markApath(): void {
  const data = loadData()
  if (!data.activeFast) return
  data.activeFast.apathTime = new Date().toISOString()
  saveData(data)
}

export function getAiUsage(): AiUsage {
  const data = loadData()
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentWeek = Math.floor(now.getDate() / 7)

  if (data.aiUsage.lastResetMonth !== currentMonth) {
    data.aiUsage.lastResetMonth = currentMonth
    data.aiUsage.monthlyCount = 0
  }

  if (data.aiUsage.lastResetWeek !== currentWeek) {
    data.aiUsage.lastResetWeek = currentWeek
    data.aiUsage.weeklyCount = 0
  }

  saveData(data)
  return data.aiUsage
}

export function saveAiReport(report: string): void {
  const data = loadData()
  data.aiUsage.lastAiReport = report
  saveData(data)
}

export function incrementAiUsage(): void {
  const data = loadData()
  if (!data.aiUsage) {
    data.aiUsage = { ...DEFAULT_DATA.aiUsage }
  }
  data.aiUsage.monthlyCount += 1
  data.aiUsage.weeklyCount += 1
  data.aiUsage.lastUsedDate = new Date().toISOString()
  saveData(data)
}

export function getLatestWeight(): number | undefined {
  const history = getHistory();
  const sorted = [...history].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  const record = sorted.find(r => r.weight !== undefined || r.journalData?.weight !== undefined);
  return record ? (record.weight ?? record.journalData?.weight) : undefined;
}
