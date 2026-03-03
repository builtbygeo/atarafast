export interface FastingPreset {
  id: string
  name: string
  fastHours: number
  eatHours: number
  color: string
  description: string
  tips: string[]
}

export const FASTING_PRESETS: FastingPreset[] = [
  {
    id: "12:12",
    name: "12:12",
    fastHours: 12,
    eatHours: 12,
    color: "oklch(0.55 0.1 250)",
    description:
      "The easiest gateway into intermittent fasting. Eat in a 12-hour window (e.g., 7 a.m.\u20137 p.m.) \u2014 basically stop late-night snacking. Even mild 12-hour overnight fasting shifts the body toward fat burning, improves metabolic flexibility, and supports weight management. Studies show better blood sugar control and reduced daily calorie intake with almost zero effort. Quick mood, hunger, and sleep wins often felt in the first week.",
    tips: [
      "Stop eating after dinner \u2014 no late-night snacks.",
      "Hydrate with water, herbal tea, or black coffee during the fast.",
      "This is a great starting point before progressing to longer fasts.",
      "Focus on whole foods during your eating window for best results.",
    ],
  },
  {
    id: "14:10",
    name: "14:10",
    fastHours: 14,
    eatHours: 10,
    color: "oklch(0.6 0.14 180)",
    description:
      "Extremely common for beginners and those who find 16:8 too strict at first. Eat in a 10-hour window (e.g., 9 a.m.\u20137 p.m.). The largest UK community study (King\u2019s College, 2023) showed eating in a 10-hour window quickly improved hunger control, mood, sleep quality, and energy levels \u2014 noticeable within days. Excellent for circadian rhythm alignment without much disruption.",
    tips: [
      "Try eating between 9 a.m. and 7 p.m. for natural alignment.",
      "High adherence rates make this great for long-term consistency.",
      "Hydrate well during the fasting hours.",
      "Prepare balanced meals to maximize the eating window.",
    ],
  },
  {
    id: "16:8",
    name: "16:8",
    fastHours: 16,
    eatHours: 8,
    color: "oklch(0.6 0.16 155)",
    description:
      "The gold standard of intermittent fasting \u2014 the most popular, easiest to stick with long-term, and backed by the strongest evidence. Eat all meals in 8 hours (e.g., noon\u20138 p.m.), fast 16 hours. Multiple studies show 3\u20138% weight loss in 8\u201312 weeks, improved insulin sensitivity, and fat loss while preserving muscle. Many feel better after just 1\u20132 weeks. Finishing eating by early evening works even better for insulin and blood pressure.",
    tips: [
      "Skip breakfast and eat your first meal at noon.",
      "Finish your last meal by 8 p.m. for best metabolic results.",
      "Black coffee and tea are fine during the fast.",
      "Consistency matters more than perfection \u2014 stick with it.",
    ],
  },
  {
    id: "18:6",
    name: "18:6",
    fastHours: 18,
    eatHours: 6,
    color: "oklch(0.7 0.15 80)",
    description:
      "A popular progression from 16:8 for those wanting faster results or deeper ketosis. Eat in a tight 6-hour window (e.g., 12 p.m.\u20136 p.m.). Trials show stronger reductions in insulin resistance, waist circumference, and inflammation compared to longer eating windows. Weight loss and metabolic improvements appear reliably in 4\u20138 weeks. Many report quicker appetite suppression and mental clarity once adapted.",
    tips: [
      "Two solid meals in a 6-hour window work well for most people.",
      "Prioritize protein and healthy fats to stay satiated.",
      "Allow 1\u20133 weeks for your body to adapt fully.",
      "Hydrate generously \u2014 water, sparkling water, and electrolytes help.",
    ],
  },
  {
    id: "20:4",
    name: "20:4",
    fastHours: 20,
    eatHours: 4,
    color: "oklch(0.6 0.18 30)",
    description:
      "Also known as the Warrior Diet \u2014 eat one large meal (or small snacks) in a 4-hour window, usually in the evening. Popular in fitness and bodybuilding circles. Studies on 4\u20136 hour eating windows show significant calorie reduction, 4\u201310%+ weight loss in 8\u201312 weeks, and improved fat loss. Deeper autophagy and ketosis can give noticeable energy and focus boosts after 2\u20134 weeks of adaptation.",
    tips: [
      "One main meal with a small snack works for most people.",
      "Nutrient density is critical \u2014 make every bite count.",
      "This is an advanced protocol; build up from 16:8 or 18:6 first.",
      "Listen to your body and break the fast if you feel unwell.",
    ],
  },
]

export const CUSTOM_PRESET: FastingPreset = {
  id: "custom",
  name: "Custom",
  fastHours: 0,
  eatHours: 0,
  color: "oklch(0.5 0.05 250)",
  description:
    "Set your own fasting duration from 1 to 168 hours. Perfect for experimenting with extended fasts or creating a schedule that fits your lifestyle.",
  tips: [
    "For fasts longer than 24 hours, ensure you stay well hydrated.",
    "Consider supplementing electrolytes for extended fasts.",
    "Break long fasts gently with light, easily digestible foods.",
    "Consult a healthcare provider before attempting very long fasts.",
  ],
}

export function getPresetById(id: string): FastingPreset | undefined {
  if (id === "custom") return CUSTOM_PRESET
  return FASTING_PRESETS.find((p) => p.id === id)
}
