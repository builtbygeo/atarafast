export interface FastingPreset {
  id: string
  name: string
  fastHours: number
  eatHours: number
  color: string
}

export const FASTING_PRESETS: FastingPreset[] = [
  {
    id: "12:12",
    name: "12:12",
    fastHours: 12,
    eatHours: 12,
    color: "oklch(0.45 0.05 240)", // Deep Muted Blue
  },
  {
    id: "14:10",
    name: "14:10",
    fastHours: 14,
    eatHours: 10,
    color: "oklch(0.5 0.07 180)", // Muted Teal
  },
  {
    id: "16:8",
    name: "16:8",
    fastHours: 16,
    eatHours: 8,
    color: "oklch(0.55 0.09 145)", // Muted Sage Green
  },
  {
    id: "18:6",
    name: "18:6",
    fastHours: 18,
    eatHours: 6,
    color: "oklch(0.6 0.12 75)", // Muted Bronze
  },
  {
    id: "20:4",
    name: "20:4",
    fastHours: 20,
    eatHours: 4,
    color: "oklch(0.5 0.15 35)", // Muted Deep Red/Clay
  },
]

export const CUSTOM_PRESET: FastingPreset = {
  id: "custom",
  name: "Custom",
  fastHours: 0,
  eatHours: 0,
  color: "oklch(0.4 0.03 260)", // Muted Slate
}

export function getPresetById(id: string): FastingPreset | undefined {
  if (id === "custom") return CUSTOM_PRESET
  return FASTING_PRESETS.find((p) => p.id === id)
}
