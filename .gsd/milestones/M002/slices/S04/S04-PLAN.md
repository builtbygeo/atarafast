---
id: S04
parent: M002
milestone: M002
provides:
  - Fixed Stats and AI data integration
  - Corrected Streak calculation
  - Restored AI Coach visibility
requires:
  - S03 (Completed)
affects:
  - Info tab stats
  - Weekly Activity chart
  - AI Coach analysis
key_files:
  - components/stats-view.tsx
  - lib/stats.ts
  - lib/storage.ts
key_decisions:
  - Uncouple stats from premium flag logic
  - Ensure local weight storage is prioritized in journal pre-fill
patterns_established:
  - Data-first debugging for analytics
observability_surfaces:
  - lib/stats.ts
  - components/stats-view.tsx
duration: ~5h
verification_result: pending
completed_at: 
---

# S04: Debug and Restore Stats and Analytics

**Fixing the data pipelines and visibility for core application analytics.**

## Goal
Restore the functionality of the Log and Info tabs, ensuring that streaks, weight trends, and AI analysis are correctly surfaced for all users.
