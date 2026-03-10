# Codebase Concerns

**Analysis Date:** 2026-03-10

## Tech Debt

**Merge Conflict in page.tsx:**
- Issue: Last merge created duplicate code blocks in `app/page.tsx`
- Files: `app/page.tsx`, `components/landing/hero-sections.tsx`
- Impact: Build may fail, visual issues on landing page
- Fix approach: Need to clean up duplicate code and resolve merge properly

**Duplicate Hero Sections:**
- Issue: Both old hero and new LandingHero component may be rendering
- Files: `app/page.tsx`
- Impact: Confusing, potential layout issues
- Fix approach: Ensure only LandingHero is used

## Known Bugs

**Black Block in Preset Detail:**
- Issue: Double container with overflow caused black block
- Files: `components/preset-detail.tsx`
- Trigger: Opening preset details
- Fix: Removed `h-full overflow-y-auto` from container

## Security Considerations

**Local Storage Only:**
- Risk: User data stored in browser localStorage
- Mitigation: No sensitive data transmitted to servers
- Note: Clear browser = lost data (intentional for privacy)

**Stripe Keys:**
- Risk: Secret keys in environment variables
- Mitigation: Use Stripe webhook for subscription updates
- Recommendation: Ensure `.env.local` is in `.gitignore`

## Performance Bottlenunks

**Large Images:**
- Problem: Hero images are large WebP files
- Files: `public/atarahero.webp`, `public/atarasamsung.webp`
- Cause: Full-resolution screenshots
- Improvement: Use optimized responsive images

**No Code Splitting:**
- Problem: All components may load at once
- Impact: Initial bundle size
- Improvement: Implement dynamic imports for heavy components

## Fragile Areas

**Middleware:**
- Files: `middleware.ts`
- Why fragile: Complex routing logic between landing and app
- Safe modification: Test thoroughly with both domains

**Subscription Logic:**
- Files: `lib/subscription.ts`
- Why fragile: Depends on Clerk metadata and Stripe webhooks
- Safe modification: Test subscription flow end-to-end

## Scaling Limits

**Local Storage:**
- Current capacity: ~5MB
- Limit: Browser storage limits
- Scaling path: Consider IndexedDB for larger data, or export/import

**No Backend:**
- Current: All processing client-side
- Limit: Can't sync across devices (by design for privacy)
- Note: This is intentional, not a bug

## Dependencies at Risk

**Next.js 16:**
- Risk: Very new version (beta/rc)
- Impact: Potential breaking changes
- Migration plan: Monitor updates, test before upgrading

**React 19:**
- Risk: New release, less battle-tested
- Impact: Potential compatibility issues
- Migration plan: Test thoroughly with new React features

## Missing Critical Features

**No Automated Tests:**
- Problem: No test suite
- Blocks: Confidence in refactoring
- Priority: High

**No Error Tracking:**
- Problem: No Sentry or similar
- Blocks: Production issue detection
- Priority: Medium

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: Utility functions, components
- Files: All components, `lib/` files
- Risk: Bugs may go unnoticed
- Priority: High

**No Integration Tests:**
- What's not tested: Full user flows
- Risk: Breaking changes undetected
- Priority: High

---

*Concerns audit: 2026-03-10*