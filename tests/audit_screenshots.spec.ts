import { test } from '@playwright/test';

const routes = [
  '/',
  '/swap',
  '/launch',
  '/add-liquidity',
  '/positions',
  '/shielded',
  '/overview',
  '/pools',
  '/contracts',
  '/tx',
  '/router',
  '/network'
];

test('audit screenshots of all routes', async ({ page }) => {
  for (const route of routes) {
    try {
      await page.goto(route);
      // Wait for some content to be visible
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `tests/screenshots/${route.replace(/\//g, '_') || 'home'}.png`, fullPage: true });
    } catch (e) {
      console.error(`Failed to capture screenshot for ${route}:`, e);
    }
  }
});
