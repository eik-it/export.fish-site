import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for eksportfiske.no visual regression tests
 *
 * This is a static Astro marketing site that runs on:
 * - Development: port 4321 (astro dev)
 * - Preview: port 4322 (astro preview)
 * - Production: GitHub Pages (https://eksportfiske.no)
 *
 * Run tests:
 *   npm run test:e2e:visual
 *
 * Run tests against different environment:
 *   BASE_URL=https://eksportfiske.no npm run test:e2e:visual
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL - defaults to preview server on port 4321 */
    baseURL: process.env.BASE_URL || 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Deterministic screenshot settings */
    // Disable animations for consistent screenshots
    reducedMotion: 'reduce',

    // Force specific color scheme for consistency
    colorScheme: 'light',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Timeout settings */
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },

  /* Web Server - automatically start preview server before tests */
  webServer: {
    command: 'npm run preview',
    port: 4321,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
