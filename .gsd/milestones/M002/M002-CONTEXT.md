# M002: Context

**Goal:** Democratize premium features and add weight tracking in a non-scrolling UI.

## Implementation Decisions
- **AI Quota Logic:** `checkAiQuota(fastCount: number)` implemented in `lib/subscription.ts`.
- **Weight Storage:** Added `weight?: number` to `FastingRecord` in `lib/storage.ts`.
- **UI:** Compact layout for Weight controls in the journal to prevent vertical scrolling.
