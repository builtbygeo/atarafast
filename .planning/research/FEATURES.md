# Feature Landscape

**Domain:** Intermittent Fasting Tracker (mobile-first PWA)
**Researched:** 2026-05-13
**Focus:** Navigation architecture — what features belong in which tab

## Table Stakes

Features every fasting app MUST surface in its primary navigation. Missing = app feels broken.

| Feature | Why Expected | Complexity | Evidence |
|---------|--------------|------------|----------|
| **Fasting Timer (primary tab)** | Core action of the app: start/stop fast, see elapsed time. Every competitor opens to the timer. Zero, Fastic, BodyFast, and Simple all use it as the default/center tab. | Low (existing) | Universal across all apps researched |
| **Current fast status** | Users need to know "am I fasting right now?" at a glance. Zero shows elapsed with phase indicator; Fastic shows "Body Status" phases; BodyFast shows fasting stage. | Low (existing) | All apps show this on timer screen |
| **Fasting history/log** | Users expect to see past fasts. Whether as a list, calendar heatmap, or timeline — every app has this. | Med (existing) | Zero: "History" tab. Fastic: in "Progress." BodyFast: in "Feed" / progress area. Simple: "Progress" tab |
| **Streak tracking** | Core motivational mechanic. Zero heavily emphasizes streaks (review mentions 809-day streaks). Users report streaks as primary reason for sticking with app. | Low (existing) | Zero's most-complimented feature in reviews |
| **Settings accessible from nav** | Users expect to change language, notifications, goals. Placement varies: gear icon in header (Zero, BodyFast) or dedicated Profile tab (Fastic). | Low (existing) | Zero: gear in header. Fastic: Profile tab. BodyFast: Profile tab |

## Differentiators

Features that set an app apart visually and experientially. Not universally expected, but highly valued when present.

| Feature | Value Proposition | Complexity | Evidence |
|---------|-------------------|------------|----------|
| **3-tab over 4-tab navigation** | Fewer tabs = less cognitive load, cleaner visual. Atara's proposed 3-tab (Today | Log | Progress) is more minimal than Zero/Fastic/BodyFast (all 4-tab). This IS a differentiator — fewer apps use 3-tab, but the ones that do (Simple, when it existed) are praised for minimalism. | Low (existing) | Atara is explicitly choosing this path |
| **Body phase visualization on timer** | Fastic and BodyFast both show an animated "what's happening in your body right now" display on the timer screen. Users mention checking the app specifically to see "what stage I'm in" as motivation. Atara has metabolic phases but they're not prominent enough visually. | Med | Fastic review: "Every time I'm tempted to break my fast early I check the app to see what stage of fat burning I'm in" |
| **Contextual education (embedded, not siloed)** | Rather than a separate Learn/Plan tab, integrating educational content alongside progress data. BodyFast's "Personal Feed" does this — tips appear contextually with your stats. This is a trend: moving from "Here's a library of articles" to "Here's what's relevant to your current fasting stage." | Med | BodyFast v4.0 introduced "Personal Feed" merging content with progress |
| **Streak + challenge integration with profile** | Users care deeply about streaks (Zero review: "809 days straight"). Challenges and badges should live where users already look — next to their progress data. Zero puts challenges in a "Challenge yourself" section adjacent to the timer screen. | Low (existing, needs reorganization) | Zero review: "I like looking at all of the badges I had received, the progress I made" |
| **Minimal, uncluttered timer screen** | The timer screen should show: elapsed time, fasting phase, and one clear CTA (end fast). Competitors that clutter the timer with upsells, nutrition trackers, or water tracking get complaints. Zero v7 added protein/water/habits to the timer screen — mixed reception. | Low (existing) | User reviews show preference for clean timer over all-in-one screens |
| **Dark theme polish** | All top fasting apps use dark themes (fasting = sleep/wake cycle association). Atara already uses dark theme. Visual polish here means: consistent depth hierarchy, proper contrast ratios, smooth transitions between fasting phases, and phase-appropriate color shifts. | Med (design task) | Zero, Fastic, BodyFast all dark-themed |

## Anti-Features

Features to explicitly NOT build, especially in navigation redesign.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **5-tab navigation** | Too many tabs increase cognitive load and reduce tap target size. Zero flirted with 5 tabs in early v7 builds before settling back to 4. Mobile bottom bars max out at ~4 before becoming unusable. | Keep 3 tabs. If content feels squeezed, use sub-navigation within tabs (segmented controls, scrollable sections). |
| **Dedicated "Learn" / "Academy" tab** | Siloed educational content has low engagement. Users don't go to a Learn tab unless prompted. Fastic's Academy and Zero's Learn both suffer from this — content should appear contextually. | Atara's plan: education lives in Progress tab, contextual to user's data. Good. |
| **Nutrition tracking on timer screen** | Zero v7 added protein/meal/water tracking to the timer → mixed reviews, complaints of "clutter." Timer screen should be singular: "I am fasting" or "I am eating." Nutrition is a separate domain. | Keep timer screen focused. If nutrition tracking is added later, put it in a different tab or secondary view. |
| **Upsell banners in bottom nav** | Some apps put premium upgrade prompts as nav items or persistent banners. Users hate this — review complaints consistently mention "ads in a paid app" or "constant upgrade prompts." | Atara: premium gates stay behind `ENABLE_PREMIUM=false` flag. The "Unlock full history" banner should be hidden when premium is disabled (this is a known bug being fixed). |
| **"Info" as a tab name** | Vague, catch-all label. Atara's current "Info" tab (with Info icon from Lucide) is overloaded: stats, programs, challenges, settings. Users don't know what to expect. Competitors use descriptive names: "Progress," "History," "Journal." | Atara's proposed "Progress" name is a major improvement. |
| **Separate "Plan" tab** | Users don't think of educational content as "planning." The mental model is: plan your fast (timer), log it (history), see results (progress). Educational content alongside progress data makes more sense. | Atara's plan to dissolve the Plan tab and move content to Progress is correct. |

## Feature Dependencies

```
Timer (Today tab)
  ├── Active Programs (naturally pairs with active timer: "what am I doing right now")
  ├── Preset plan selector (quick-start fasting plans)
  └── Onboarding → recommends first plan → starts timer

History (Log tab)
  ├── Calendar heatmap (date-based visualization)
  ├── Recent fasts list (chronological)
  ├── Edit/delete individual records
  ├── Journal entries (per-fast reflections)
  └── Premium gate: 30-day limit (hidden when ENABLE_PREMIUM=false)

Progress (was Info + Plan)
  ├── Stats: streaks, weekly activity, completion rate, weight trends
  ├── Challenges: 13 challenges across streak/duration/milestone categories
  ├── AI Coach: gated behind 5-fast minimum, daily quota
  ├── Educational content: fasting tips, health info, preset plan descriptions
  └── Settings: accessible via gear icon in header (not as a nav item)
```

## Competitor Tab Architecture Comparison

| App | Tab 1 | Tab 2 | Tab 3 | Tab 4 | Settings |
|-----|-------|-------|-------|-------|----------|
| **Atara (current)** | History/Log | Stats/Info | Timer/Today | Plan | Settings sheet from Info tab |
| **Atara (proposed)** | Today | Log | Progress | — | Gear icon in Progress header |
| **Zero (v7)** | Today (timer+nutrition) | History | Learn | Profile | Gear icon in header |
| **Fastic** | Fast (timer+phases) | Progress (score+stats) | Discover (academy+challenges) | Profile | Profile tab |
| **BodyFast** | Timer | Feed (coaching+articles) | Progress (weight+trophies) | Profile | Profile tab |
| **Simple** (historical) | Fasting | Progress | Me | — | In Me tab |

**Key takeaway:** Atara's proposed 3-tab structure is more minimal than the market-leading apps but follows the same content logic: action (Today) → record (Log) → reflect (Progress). This is a defensible and differentiating choice. The 4-tab competitors are adding features Atara deliberately chooses not to build (nutrition tracking, social features, barcode scanning).

## MVP Recommendation for Navigation Redesign

**Prioritize (Phase 1 — this milestone):**

1. **Timer as Today tab** — Primary action, center-stage. Include Active Programs alongside timer (already decided).
2. **History as Log tab** — Clean, chronological list with calendar heatmap. Fix the premium banner bug (hide when premium is disabled).
3. **Progress tab** — Merge stats + challenges + AI coach + educational content. This is the biggest change and needs the most design thought — how to organize multiple content types under one tab without it feeling like the old overloaded "Info" tab.

**Polish within tabs:**

1. **Timer screen visual polish:** Smooth phase transitions, subtle color shifts corresponding to metabolic phases, prominent streak display.
2. **Progress tab sub-navigation:** Consider a segmented control or scrollable sections (Stats | Challenges | Coach | Learn) rather than one long scroll — this is the riskiest part of the redesign.
3. **Settings access:** Gear icon in Progress header is the right call — keeps settings accessible without consuming a tab slot.

**Defer:**
- **Nutrition/water tracking:** Out of scope. Competitors are adding this, but it requires significant new infrastructure and does not align with Atara's minimalist vision.
- **Social features (fasting buddies, sharing):** Out of scope. Fastic and BodyFast have these but they add complexity without clear fasting-outcome improvement.
- **Wearable integrations:** Out of scope. Zero syncs with Oura. BodyFast has step counter. Not essential for Atara's current scale.

## Anti-Patterns Observed in Competitors

### 1. The "Everything Tab"
Zero's Today tab has grown to include: timer, protein tracking, meal logging, hydration, activity, sleep, and mood. Users report feeling overwhelmed. **Atara mitigation:** Keep Today focused on timer + active programs only.

### 2. Premium Feature Teasers in Free Nav
Several apps show locked/chained icons in their tab bar for premium features. This frustrates users and feels like ads. **Atara mitigation:** Premium gates hidden behind `ENABLE_PREMIUM=false`. No teasers in nav.

### 3. Overloading the Timer with Post-Fast Actions
Some apps immediately push journaling, meal logging, and weight entry after ending a fast. Users want to end their fast and move on — optional journaling (Atara already has this as a dialog) is the right balance. **Atara:** Already correct — journal dialog is optional, can be skipped.

## Sources

- **Zero App Store listing** (App Store, fetched 2026-05-13) — Feature list, version history (v7.6.0), user review themes: [apps.apple.com/us/app/zero-fasting-food-tracker/id1168348542](https://apps.apple.com/us/app/zero-fasting-food-tracker/id1168348542)
- **Fastic App Store listing** (App Store, fetched 2026-05-13) — Feature categorization, subscription model, user review themes: [apps.apple.com/us/app/fastic-weight-loss-fasting/id1459260306](https://apps.apple.com/us/app/fastic-weight-loss-fasting/id1459260306)
- **BodyFast App Store listing** (App Store, fetched 2026-05-13) — Feature list, "Personal Feed" introduction in v4.0, 50M+ installs claim: [apps.apple.com/us/app/bodyfast-intermittent-fasting/id1189568780](https://apps.apple.com/us/app/bodyfast-intermittent-fasting/id1189568780)
- **Atara source code** (`app/app/page.tsx`, lines 98-103) — Current tab configuration: History | Stats | Timer | Plan
- **PROJECT.md** (`.planning/PROJECT.md`) — Proposed tab structure: Today | Log | Progress

### Confidence Assessment

| Source | Confidence | Reason |
|--------|-----------|--------|
| Competitor feature lists (App Store) | HIGH | Official Apple listings, current as of 2026-05-13 |
| Competitor tab architecture | MEDIUM | Inferred from feature lists, version changelogs, and user review descriptions. App Store listings do not explicitly describe tab bar structure — navigation patterns are reconstructed from feature groupings and review mentions. |
| Atara current state | HIGH | Verified against source code (`app/app/page.tsx`) |
| "Simple" app navigation | LOW | Training data only — App Store URL not found (may be delisted/rebranded). Included for historical context as an influential 3-tab example. |
