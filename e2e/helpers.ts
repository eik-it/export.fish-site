import { Page } from '@playwright/test';

/**
 * Helper utilities for E2E visual regression tests
 */

/**
 * Screenshot utility for visual regression testing
 * Captures full-page screenshots in a fixed directory for git-based comparison
 *
 * Screenshots are saved to screenshots/ directory and should be committed
 * to git. PRs will show visual diffs when UI changes.
 *
 * @param page - Playwright page object
 * @param screenshotName - Name for the screenshot (e.g., "desktop-full-page", "mobile-full-page")
 * @param options - Optional screenshot configuration
 */
export async function captureScreenshot(
  page: Page,
  screenshotName: string,
  options: {
    fullPage?: boolean;
    directory?: string;
  } = {}
): Promise<void> {
  const {
    fullPage = true,
    directory = 'screenshots',
  } = options;

  // Sanitize screenshot name (replace spaces and special chars with hyphens)
  const sanitizedName = screenshotName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Save to fixed directory: screenshots/screenshot-name.png
  const screenshotPath = `${directory}/${sanitizedName}.png`;

  // Scroll to top before screenshot to ensure consistent positioning
  await page.evaluate(() => window.scrollTo(0, 0));

  // Wait for any pending animations/transitions to complete
  await page.waitForTimeout(300);

  // Ensure all images and fonts are fully loaded
  await page.evaluate(() => document.fonts.ready);

  // Wait for network idle to ensure no pending requests
  await page.waitForLoadState('networkidle');

  await page.screenshot({
    path: screenshotPath,
    fullPage,
    // Use consistent screenshot settings for determinism
    animations: 'disabled', // Disable CSS animations and transitions
  });

  console.log(`📸 Screenshot saved: ${screenshotPath}`);
}
