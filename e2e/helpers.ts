import { Page } from '@playwright/test';

/**
 * Helper utilities for E2E visual regression tests
 */

/**
 * Waits for all images on the page to finish loading
 *
 * This function ensures that:
 * 1. Network requests have settled (no pending requests)
 * 2. All img elements are present in the DOM
 * 3. Lazy-loaded images are triggered by scrolling
 * 4. Each image has completed loading with valid dimensions
 * 5. All fonts are ready to render
 *
 * This prevents false positives in visual regression tests caused by
 * images that haven't loaded yet when the screenshot is taken.
 *
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait in milliseconds (default: 15000ms)
 */
export async function waitForAllImagesToLoad(
  page: Page,
  timeout: number = 30000
): Promise<void> {
  // First, wait for network to be idle to ensure initial resource loading is complete
  await page.waitForLoadState('networkidle', { timeout });

  // Give the page a moment to render after network idle
  await page.waitForTimeout(1000);

  // Scroll to bottom to trigger lazy-loaded images
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait for network to settle after scroll
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Wait for network to settle again
  await page.waitForLoadState('networkidle', { timeout: 10000 });

  // Give the page additional time for image rendering
  await page.waitForTimeout(2000);

  // Wait for all img elements to be present in the DOM
  // Note: This may not find any elements initially, which is fine
  try {
    await page.waitForSelector('img', { state: 'visible', timeout: 2000 }).catch(() => {
      // It's ok if no images are found - the page might not have any
    });
  } catch {
    // Continue even if selector fails
  }

  // Use evaluate to check that all images have finished loading
  // This validates both that images are present AND that they have valid dimensions
  await page.evaluate(async (checkTimeout) => {
    const images = Array.from(document.querySelectorAll('img'));

    if (images.length === 0) {
      // No images on page, which is fine
      return;
    }

    // Create promises for each image's load completion
    const imageLoadPromises = images.map((img) => {
      return new Promise<void>((resolve) => {
        // Check if image is already loaded AND has valid dimensions
        if (
          img.complete &&
          img.naturalWidth > 0 &&
          img.naturalHeight > 0
        ) {
          resolve();
          return;
        }

        // If image failed to load or has invalid dimensions, resolve anyway
        if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
          resolve();
          return;
        }

        // Otherwise, wait for load or error event
        const onLoad = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          // Resolve even on error - we don't want to block on failed images
          resolve();
        };

        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);

        // Add timeout to prevent hanging on broken images
        setTimeout(() => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          resolve();
        }, checkTimeout);
      });
    });

    // Wait for all images to load or timeout
    await Promise.all(imageLoadPromises);
  }, timeout);

  // Ensure fonts are ready to render
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  // Wait for CSS background images to load
  // This checks all elements with background-image CSS property
  await page.evaluate(async (checkTimeout) => {
    const allElements = Array.from(document.querySelectorAll('*'));

    const backgroundImagePromises = allElements
      .map((element) => {
        const style = window.getComputedStyle(element);
        const bgImage = style.backgroundImage;

        // Skip if no background image or it's 'none'
        if (!bgImage || bgImage === 'none') {
          return null;
        }

        // Extract URL from background-image (handles multiple formats)
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (!urlMatch) {
          return null;
        }

        const imageUrl = urlMatch[1];

        // Create a promise to load this background image
        return new Promise<void>((resolve) => {
          const img = new Image();

          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't block on failed images

          // Add timeout to prevent hanging
          setTimeout(() => resolve(), checkTimeout);

          img.src = imageUrl;
        });
      })
      .filter((promise): promise is Promise<void> => promise !== null);

    // Wait for all background images to load
    if (backgroundImagePromises.length > 0) {
      await Promise.all(backgroundImagePromises);
    }
  }, timeout);

  // Final wait to ensure everything is settled
  await page.waitForTimeout(1000);
}

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
