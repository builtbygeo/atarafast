"use client"

import { useState } from "react"
import { FASTING_PRESETS, CUSTOM_PRESET } from "@/lib/presets"
import { ChevronRight } from "lucide-react"
import { useLang } from "@/lib/language-context"

export function PlanView() {
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null)

  const allPresets = [...FASTING_PRESETS, CUSTOM_PRESET]

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Fasting Plans</h2>
        <p className="text-sm text-muted-foreground">
          Learn about different intermittent fasting protocols and find what works for you.
        </p>
      </div>

      <div className="space-y-3">
        {allPresets.map((preset) => {
          const isExpanded = expandedPreset === preset.id

          return (
            <div
              key={preset.id}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedPreset(isExpanded ? null : preset.id)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: preset.color }}
                  >
                    {preset.fastHours > 0 ? `${preset.fastHours}h` : "?"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {preset.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {preset.fastHours > 0
                        ? `${preset.fastHours}h fast / ${preset.eatHours}h eat`
                        : "Custom duration"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Tips</h4>
                    <ul className="space-y-2">
                      {preset.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Note:</strong> Always consult with a healthcare
          provider before starting any fasting protocol, especially if you have existing health
          conditions, are pregnant, or take medication.
        </p>
      </div>
    </div>
  )
}
