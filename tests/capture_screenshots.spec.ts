
import { test } from '@playwright/test';

const pages = [
  '/',
  '/add-liquidity',
  '/positions',
  '/shielded',
  '/swap',
  '/launch',
  '/pools',
  '/tokens',
  '/overview',
  '/network',
  '/contracts',
  '/router',
  '/tx'
];

test('capture screenshots', async ({ page }) => {
  test.setTimeout(120000);
  for (const path of pages) {
    try {
      console.log(`Capturing ${path}...`);
      await page.goto(`http://localhost:3001${path}`);
      await page.waitForTimeout(2000); // Wait for some animations/loading
      const filename = path === '/' ? 'home' : path.replace(/\//g, '');
      await page.screenshot({ path: `docs/screenshots/${filename}.png`, fullPage: true });
    } catch (e) {
      console.error(`Failed to capture ${path}: $((e as Error).message)`);
    }
  }
});
