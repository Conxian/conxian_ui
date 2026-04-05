import { test, expect } from '@playwright/test';

test('debug /network page', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to /network...');
  try {
    const response = await page.goto('http://localhost:3001/network', { waitUntil: 'networkidle' });
    console.log('Response status:', response?.status());
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/final_network_check.png' });
  } catch (e) {
    console.error('Navigation failed:', e);
  }
});
