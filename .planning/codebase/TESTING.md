# Testing Patterns

**Analysis Date:** 2026-05-12

## Test Framework

**Runner:**
- Playwright v1.58.2 (e2e tests only)
- Config: `playwright.config.ts`

**Unit Testing:**
- No unit test framework detected (no Jest, no Vitest)
- No `*.test.ts` or `*.spec.ts` files outside of `tests/e2e/`
- `test_*.ts` and `*.test.js` are listed in `.gitignore` — indicating awareness of unit tests but none present

**Run Commands:**
```bash
npm run test:e2e       # Run Playwright e2e tests
```

No watch mode or coverage commands configured.

## Test File Organization

**Location:**
- All tests in `tests/e2e/` directory
- Only one test file exists: `tests/e2e/quota.spec.ts`

**Naming:**
- Pattern: `*.spec.ts` (Playwright convention)
- Test files named after feature under test (e.g., `quota.spec.ts`)

**Structure:**
```
tests/
  e2e/
    quota.spec.ts        # Quota and AI Coach access tests
test-results/            # Playwright output (not committed)
  .last-run.json         # Last test run status
  quota-.../             # Per-test failure artifacts
    error-context.md     # Page snapshot at failure
```

## Test Structure

**Suite Organization:**
```typescript
// tests/e2e/quota.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Quota and AI Coach Access', () => {

  test('user with < 5 fasts cannot access AI Coach', async ({ page }) => {
    // 1. Mock API response
    await page.route('/api/user/profile', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fastsCompleted: 0, isPremium: false })
    }));

    // 2. Navigate
    await page.goto('/app');

    // 3. Interact
    await page.click('button[aria-label="Stats"]');
    
    // 4. Assert
    await page.waitForSelector('text=5 fasts needed to unlock AI Coach');
  });

  test('user with >= 5 fasts limited to 1 AI usage per day', async ({ page }) => {
    await page.route('/api/user/profile', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fastsCompleted: 5, isPremium: false })
    }));

    await page.goto('/app');
    await page.click('button[aria-label="Stats"]');

    // First usage allowed
    await page.fill('textarea', 'How do I fast?');
    await page.click('text=Generate Insights');
    await expect(page.locator('.response')).toBeVisible();

    // Second usage blocked
    await page.fill('textarea', 'What about hydration?');
    await page.click('text=Generate Insights');
    await expect(page.locator('.quota-error')).toContainText('1/day');
  });
});
```

**Patterns:**
- **Setup:** API route mocking via `page.route()` for controlled test state
- **Assertions:** `expect(...).toBeVisible()`, `expect(...).toContainText(...)`, `page.waitForSelector(...)`
- **No fixtures or test hooks** (`beforeEach`/`afterEach`) are used in the existing tests
- **No page object models** — selectors are inline (CSS selectors, aria labels, text selectors)

## Mocking

**Framework:** Playwright route interception (`page.route()`)

**Patterns:**
```typescript
// Mock an API endpoint response
await page.route('/api/user/profile', route => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ fastsCompleted: 0, isPremium: false })
}));
```

No module-level mocking (jest.mock, vi.mock) is available since there is no unit test framework.

**What to Mock:**
- API endpoints to control user state (profile, subscription status)
- External service responses (OpenRouter AI, Stripe)

**What NOT to Mock:**
- Page rendering and DOM interactions (tests are e2e, not component-isolated)

## Fixtures and Factories

**Test Data:**
No test data factories or fixtures currently exist. Test data is inline in the test body:
```typescript
body: JSON.stringify({ fastsCompleted: 0, isPremium: false })
body: JSON.stringify({ fastsCompleted: 5, isPremium: false })
```

**Location:** No fixtures directory exists.

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

**View Coverage:** No coverage command available.

## Test Types

**Unit Tests:**
- **None exist.** The project has no unit test framework or unit test files.
- `test_*.ts` and `*.test.js` are in `.gitignore`, suggesting unit tests were considered but not implemented.

**Integration Tests:**
- **None exist.** No integration test patterns detected.

**E2E Tests:**
- **Framework:** Playwright
- **Scope:** Only quota/AI-coach access flow
- **Status:** Last run failed (2 tests in `test-results/.last-run.json` marked as `"status": "failed"`)
- **Failure mode:** Tests hit Clerk authentication gate — the error snapshot shows the sign-in page instead of the app page, meaning tests are running against an unauthenticated state
- **Known issue:** No authentication mocking pattern is used; tests rely on a hardcoded cookie (`'Cookie': 'your-session-cookie-here'` in `playwright.config.ts`) which does not provide valid Clerk auth

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):
- Runs on PR to `main`
- Steps: checkout, setup Node.js 20, `npm install`, `npm run build`
- **Tests are NOT run in CI.** The workflow only validates that the project builds.

## Common Patterns

**Async Testing:**
Tests use Playwright's built-in async/await pattern with `page` fixture. No custom async patterns needed since tests interact with a real browser.

**Error Testing:**
Error states tested via UI assertions:
```typescript
await page.waitForSelector('text=5 fasts needed to unlock AI Coach');
await expect(page.locator('.quota-error')).toContainText('1/day');
```

## Test Gaps

**Critical gaps:**
1. No unit tests for lib functions (storage, quota, stats, programs — all pure logic)
2. No component tests (timer view, history view, onboarding flow, settings)
3. Only 2 e2e tests, both for the same feature (quota)
4. No tests for: timer start/end, preset selection, history management, journal flow, onboarding, settings, Stripe checkout flow, AI coach integration, language switching, data export/import
5. No authenticated-state e2e tests (current tests fail due to missing auth)
6. No visual regression testing
7. No accessibility tests
8. No performance tests

---

*Testing analysis: 2026-05-12*
