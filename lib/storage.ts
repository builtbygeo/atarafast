export interface FastingRecord {
  id: string
  presetId: string
  startTime: string
  endTime: string | null
  targetHours: number
  completed: boolean
  apathTime?: string // Апатия - moment of freedom from hunger cravings
  notes?: string
}

export interface AppSettings {
  timerDirection: "up" | "down"
}

interface StoredData {
  activeFast: FastingRecord | null
  history: FastingRecord[]
  settings: AppSettings
  lastFastInfo: { presetId: string; targetHours: number } | null
}

const STORAGE_KEY = "fasting-tracker-data"

const DEFAULT_DATA: StoredData = {
  activeFast: null,
  history: [],
  settings: {
    timerDirection: "down",
  },
  lastFastInfo: null,
}

function loadData(): StoredData {
  if (typeof window === "undefined") return DEFAULT_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    return JSON.parse(raw) as StoredData
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

export function getSettings(): AppSettings {
  return loadData().settings
}

export function updateSettings(settings: Partial<AppSettings>): void {
  const data = loadData()
  data.settings = { ...data.settings, ...settings }
  saveData(data)
}

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2)
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
