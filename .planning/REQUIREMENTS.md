# Requirements: Atara

**Defined:** 2026-05-13
**Core Value:** A user can track, analyze, and improve their fasting practice through an intuitive, minimal interface that gets out of the way.

## v1 Requirements

### Navigation

- [x] **NAV-01**: Bottom nav restructured from 4 tabs (Log | Info | Today | Plan) to 3 tabs (Today | Log | Progress)
- [x] **NAV-02**: Tab bar visual polish — active indicator styling, consistent spacing, dark theme glass effect, typography refinement

### Content Reorganization

- [x] **CONT-01**: Active Programs grid moved from Info/Stats tab to Today tab (alongside timer)

### Bug Fixes

- [x] **FIX-01**: 30-day history filter and "Unlock full history" banner hidden behind `ENABLE_PREMIUM` flag check — no limit or banner when premium is disabled

## v2 Requirements

Deferred to future release.

### Content Reorganization

- **CONT-02**: Educational content (preset descriptions, fasting tips, health info) moved from Plan tab to Progress tab
- **CONT-03**: Settings gear icon placed in Progress tab header

### UI Polish

- **NAV-03**: Tab transition animation — opacity crossfade (150ms) between tab views
- **NAV-04**: framer-motion layoutId spring-animated tab indicator dot

### Bug Fixes

- **FIX-02**: Timer state preservation — CSS visibility toggle so timer keeps running across tab switches
- **FIX-03**: Scroll container audit — fix pb/padding after content moves between views

### Accessibility

- **NAV-05**: Language toggle (EN/BG) accessible from all tabs, not just Progress

## Out of Scope

| Feature | Reason |
|---------|--------|
| New functionality | Reorganization + polish only — no new features |
| Premium/payment activation | Code stays behind `ENABLE_PREMIUM=false` |
| Backend/database changes | Stays localStorage-only |
| New dependencies | Stack unchanged (Next.js 16, React 19, Tailwind 4) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| CONT-01 | Phase 1 | Complete |
| FIX-01 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 4 total
- Mapped to phases: 4
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-13*
*Last updated: 2026-05-13 after roadmap creation*
