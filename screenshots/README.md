# Screenshots - Visual Regression Testing

This directory contains reference screenshots for visual regression testing.

## Purpose

Screenshots are captured by the E2E test suite to track UI changes over time. When UI changes are made, the screenshots in this directory will show diffs in pull requests, making it easy to review visual changes.

## Usage

### Generate Screenshots

Run the visual regression test suite to generate/update screenshots:

```bash
# Install Playwright browsers first (one-time setup)
npx playwright install chromium

# Build the site
npm run build

# Generate all screenshots
npm run test:e2e:visual

# Run with UI mode for debugging
npm run test:e2e:ui
```

### Review Changes

1. **In Pull Requests**: GitHub automatically shows image diffs when screenshots change
2. **Locally**: Use `git diff screenshots/` to see which screenshots changed

### Screenshot Files

The test suite captures 3 full-page screenshots:

- `desktop-full-page.png`: Desktop view (1280x720)
- `mobile-full-page.png`: Mobile view (iPhone SE, 375x667)
- `tablet-full-page.png`: Tablet view (iPad, 768x1024)

## Best Practices

- **Commit screenshots**: Always commit screenshot updates with UI changes
- **Review carefully**: Check screenshot diffs in PRs before merging
- **Update regularly**: Re-run visual tests when making UI changes
- **Keep consistent**: Tests use fixed viewport sizes for deterministic results

## Notes

- Screenshots are captured with animations disabled for consistency
- All screenshots are full-page, capturing the entire scrollable content
- Tests automatically start the preview server before running
- The simplified 3-screenshot approach makes tests faster while still catching major visual changes
