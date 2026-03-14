import { test, expect } from '@playwright/test';

test.describe('Quota and AI Coach Access', () => {

  test('user with < 5 fasts cannot access AI Coach', async ({ page }) => {
    // 1. Mock user state with 0 fasts
    await page.route('/api/user/profile', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fastsCompleted: 0, isPremium: false })
    }));

    await page.goto('/app');
    // Stats is the 2nd tab
    await page.click('button[aria-label="Stats"]');
    
    // Expect error or modal explaining the 5-fasts requirement
    await page.waitForSelector('text=5 fasts needed to unlock AI Coach');
  });

  test('user with >= 5 fasts limited to 1 AI usage per day', async ({ page }) => {
    // 1. Mock user state with 5 fasts
    await page.route('/api/user/profile', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fastsCompleted: 5, isPremium: false })
    }));

    await page.goto('/app');
    await page.click('button[aria-label="Stats"]');

    // First usage allowed (implied, test success)
    await page.fill('textarea', 'How do I fast?');
    await page.click('text=Generate Insights');
    await expect(page.locator('.response')).toBeVisible();

    // 2. Second usage blocked
    await page.fill('textarea', 'What about hydration?');
    await page.click('text=Generate Insights');
    await expect(page.locator('.quota-error')).toContainText('1/day');
  });
  });
});
