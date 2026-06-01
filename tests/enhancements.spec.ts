import { test, expect } from '@playwright/test';

test('capture governance portal', async ({ page }) => {
  await page.goto('/governance');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'docs/screenshots/governance.png', fullPage: true });
});

test('capture sandbox interface', async ({ page }) => {
  await page.goto('/sandbox');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'docs/screenshots/sandbox.png', fullPage: true });
});

test('capture telemetry enhancement', async ({ page }) => {
  await page.goto('/network');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'docs/screenshots/telemetry_enhanced.png', fullPage: true });
});

test('capture sdk storefront', async ({ page }) => {
  await page.goto('/sdk');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'docs/screenshots/sdk_storefront.png', fullPage: true });
});
