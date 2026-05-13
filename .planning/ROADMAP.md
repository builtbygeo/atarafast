# Roadmap: Atara

## Overview

Atara's v1 redesign consolidates the 4-tab bottom navigation (Log | Info | Today | Plan) into an elegant 3-tab structure (Today | Log | Progress). Content is reorganized to match the user's mental model — timer and active programs live together in Today, history stays in Log, and stats, challenges, AI coach, and education merge into a coherent Progress tab. The premium gate bug is fixed and the tab bar receives visual polish. This is a pure reorganization with no new features, no new dependencies, and no backend changes.

## Phases

- [ ] **Phase 1: 3-Tab Navigation Restructure** — Reorganize 4-tab nav to 3-tab, move content, fix premium gate bug, and apply visual polish

## Phase Details

### Phase 1: 3-Tab Navigation Restructure
**Goal**: Users navigate their fasting tracker through a polished 3-tab interface with correctly organized content and no broken premium UI
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, NAV-02, CONT-01, FIX-01
**Success Criteria** (what must be TRUE):
  1. User opens the app and sees 3 bottom tabs — Today, Log, Progress — replacing the previous 4-tab layout (Log | Info | Today | Plan)
  2. Active Programs are visible and interactive in the Today tab, displayed alongside the fasting timer
  3. User can view their complete fasting history in the Log tab without a 30-day limit or premium upgrade banner when premium is disabled
  4. User's fasting timer continues running uninterrupted when switching between tabs and returning to Today
  5. Tab bar has polished visual styling: animated active indicator, consistent spacing, dark theme backdrop blur, and clear typography in both English and Bulgarian
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 3-Tab Navigation Restructure | 0/TBD | Not started | - |
