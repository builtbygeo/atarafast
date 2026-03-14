# Testing Patterns

**Analysis Date:** 2026-03-10

## Test Framework

**Runner:**
- No dedicated test framework currently configured
- Manual testing via dev server

**Build Validation:**
```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # ESLint check
```

**Run Commands:**
```bash
npm run dev              # Start dev server at localhost:3000
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
```

## Test File Organization

**Location:**
- No dedicated test directory
- Manual testing approach

**Coverage:**
- No automated tests currently
- Manual QA via browser

## Test Types

**Manual Testing:**
- Dev server at http://localhost:3000
- Test all user flows:
  - Landing page renders correctly
  - Sign up / Sign in flow
  - Start/complete fast
  - View statistics
  - Settings changes
  - Subscription flow (test mode)

## Common Patterns

**Development Testing:**
1. Run `npm run dev`
2. Open http://localhost:3000
3. Test in browser DevTools
4. Check console for errors

**Build Testing:**
1. Run `npm run build`
2. Verify no errors
3. Run `npm run start` to test production build

---

*Testing analysis: 2026-03-10*
