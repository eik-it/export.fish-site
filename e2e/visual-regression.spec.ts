import { test } from '@playwright/test';
import { captureScreenshot } from './helpers';

/**
 * Visual Regression Test Suite for eksportfiske.no
 *
 * This suite captures full-page screenshots across 3 key viewport sizes
 * for visual comparison between versions and design iterations.
 *
 * Screenshots are saved to: screenshots/*.png
 * These files should be committed to git so PRs show visual diffs.
 *
 * Usage:
 * - Run all visual tests: npm run test:e2e:visual
 * - View changes in PR: GitHub will show image diffs automatically
 * - Local comparison: git diff screenshots/
 */

test.describe('Visual Regression - Full Page Screenshots @visual', () => {

  test('Desktop - Full page', async ({ page }) => {
    // Use default desktop viewport (1280x720)
    await page.goto('/');

    // Wait for images to load
    await page.waitForSelector('img', { state: 'visible' });

    await captureScreenshot(page, 'desktop-full-page');
  });

  test('Mobile - Full page', async ({ page }) => {
    // Set mobile viewport (iPhone SE size)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait for images to load
    await page.waitForSelector('img', { state: 'visible' });

    await captureScreenshot(page, 'mobile-full-page');
  });

  test('Tablet - Full page', async ({ page }) => {
    // Set tablet viewport (iPad size)
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Wait for images to load
    await page.waitForSelector('img', { state: 'visible' });

    await captureScreenshot(page, 'tablet-full-page');
  });
});
