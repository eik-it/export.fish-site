# Visual Regression Testing Setup

This document describes the visual regression testing setup for the eksportfiske.no marketing site.

## Overview

Visual regression testing automatically captures screenshots of the website and commits them to the repository. When changes are made to the UI, GitHub will show before/after comparisons in pull requests, making it easy to review visual changes.

## How It Works

1. **On Pull Request**: When you create or update a PR that affects the UI (changes to `src/`, `public/`, `e2e/`, etc.), the GitHub Actions workflow automatically runs
2. **Screenshot Generation**: The workflow builds the site, starts a preview server, and runs Playwright tests that capture screenshots
3. **Automatic Commit**: If screenshots have changed, they are automatically committed to the PR branch
4. **Visual Diff**: GitHub shows the before/after comparison for each changed image

## What Gets Tested

The visual regression suite captures **3 full-page screenshots** across different viewport sizes:

1. **Desktop** (1280x720) - Full homepage
2. **Mobile** (375x667 - iPhone SE) - Full homepage
3. **Tablet** (768x1024 - iPad) - Full homepage

This simplified approach captures the entire page at each viewport size, making tests faster while still catching major visual changes across all sections and responsive breakpoints.

## Files Added

```
/workspace/master/
├── e2e/
│   ├── helpers.ts                          # Screenshot capture utilities
│   └── visual-regression.spec.ts           # Visual regression test suite
├── screenshots/
│   └── README.md                           # Screenshots documentation
├── .github/workflows/
│   └── visual-regression-screenshots.yml   # GitHub Actions workflow
├── playwright.config.ts                    # Playwright configuration
└── VISUAL_REGRESSION_SETUP.md             # This file
```

## Running Tests Locally

### First-Time Setup

```bash
# Install Playwright browsers (one-time)
npx playwright install chromium
```

### Running Tests

```bash
# Build the site first
npm run build

# Run all visual regression tests
npm run test:e2e:visual

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests with browser visible
npm run test:e2e:headed
```

Screenshots will be saved to the `screenshots/` directory.

## Reviewing Changes in PRs

When a PR includes visual changes:

1. Look for the workflow comment indicating screenshots were updated
2. Go to the "Files changed" tab in the PR
3. Find the changed screenshots in the `screenshots/` folder
4. GitHub will show a side-by-side comparison with a slider
5. Review the visual changes to ensure they're intentional

## Example: Visual Changes in PRs

When UI changes are made (e.g., updating images, changing layouts, modifying styles), the visual regression workflow will:

1. Automatically detect the changes
2. Capture new full-page screenshots across all viewport sizes
3. Commit the updated screenshots to the PR
4. Show before/after comparison in the PR

The affected screenshots will be:
- `desktop-full-page.png` (desktop view)
- `mobile-full-page.png` (mobile view)
- `tablet-full-page.png` (tablet view)

## Modifying Tests

The test suite is intentionally kept simple with just 3 full-page screenshots. If you need to add specific viewport sizes or different pages:

1. Edit `e2e/visual-regression.spec.ts`
2. Use the `captureScreenshot()` helper function
3. Name screenshots descriptively (e.g., `about-page-desktop`)
4. Run tests locally to generate the screenshots
5. Commit both the test code and the generated screenshots

Example for adding a new page:

```typescript
test('About page - Desktop', async ({ page }) => {
  await page.goto('/about');
  await page.waitForSelector('img', { state: 'visible' });
  await captureScreenshot(page, 'about-page-desktop');
});
```

## Troubleshooting

### Screenshots Look Different Locally

This is expected! Different environments may render slightly differently. The important thing is consistency within the CI environment where the official screenshots are generated.

### Test Timeout

If tests timeout, ensure:
- The site builds successfully (`npm run build`)
- Port 4321 is not already in use
- You have sufficient system resources

### Missing Dependencies

If you see warnings about missing browser dependencies, you may need to install system packages. On CI (GitHub Actions), all dependencies are automatically installed.

## Technical Details

### Configuration

- **Browser**: Chromium only (for consistency)
- **Viewport**: Multiple sizes (desktop, mobile, tablet)
- **Animations**: Disabled for deterministic screenshots
- **Color Scheme**: Light mode only
- **Screenshots**: Full page and section-specific captures

### CI Workflow

The GitHub Actions workflow:
1. Checks out the PR branch
2. Installs Node.js and npm dependencies
3. Installs Playwright with system dependencies
4. Builds the Astro site
5. Runs visual regression tests
6. Detects screenshot changes
7. Commits and pushes updated screenshots to the PR

### Astro Integration

The Playwright config is set up to:
- Automatically start `npm run preview` before tests
- Wait for the server to be ready on port 4321
- Run all tests against the built static site
- Shut down the server after tests complete

## Best Practices

1. **Always run tests before committing**: Generate screenshots locally and review them
2. **Keep screenshots organized**: Use numeric prefixes for logical ordering
3. **Review all changes**: Even small visual changes should be intentional
4. **Update tests when adding sections**: New page sections should have corresponding tests
5. **Test responsive behavior**: Include mobile and tablet tests for responsive sections

## Future Enhancements

Potential improvements for the future:

- [ ] Dark mode visual regression tests
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Visual regression for different languages (if internationalization is added)
- [ ] Performance metrics alongside visual tests
- [ ] Automated visual diff reporting in PR comments
