import { test, expect } from '@playwright/test';

test('Swap page should render and allow token selection', async ({ page }) => {
  await page.goto('http://localhost:3001/swap');

  // Verify heading
  const heading = page.locator('h1');
  await expect(heading).toContainText('Swap');

  // Open token select
  await page.click('button[aria-label^="Select token"]');

  // Verify token list is visible
  const listbox = page.locator('ul[role="listbox"]');
  await expect(listbox).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'swap-page.png' });
});
