# Buggy MUI Example — Debugging Exercise

This small repository provides a minimal HTML page demonstrating two UI issues in the usage of MUI v5 + React: a tooltip/aria-label mismatch (accessibility) and an Autocomplete caret/focus problem.

## What was fixed

1. Tooltip and aria-label semantics mismatch
   - Problem: Tooltip shows "Delete" while the `aria-label` on the `IconButton` was "Delete current item". Screen readers could announce the `aria-label` text instead of what's visible, causing inconsistent experience.
   - Fix: Set the `aria-label` to match the visible tooltip label `"Delete"`, ensuring the accessible name matches the visible tooltip.

2. Autocomplete caret / focus issue after blur
   - Problem: The input is fully controlled (`value` + `inputValue`) and, after selecting a value and blurring, re-focusing sometimes left the input caret missing or placed incorrectly.
   - Fix: Keep the internal `inputValue` in-sync with the selection and store a ref to the underlying input element; when the input receives focus we explicitly set the cursor to the end via `setSelectionRange`.

## Files

- `input.html` — Fixed HTML file with minor JS logic improvements to fix the two bugs.
- `test-runner.js` — Node-based test runner using Playwright to run automated checks for both issues.
- `setup.js` — Cross-platform setup script to install project dependencies and Playwright browsers.
- `package.json` — Minimal package manifest with helpful npm scripts.

## Reproduction steps

1. Install dependencies: `npm run setup` (This runs `npm ci` and installs Playwright browsers).
2. Run the tests: `npm test`.

Manual verification steps to reproduce the original bugs (now fixed):

- Tooltip/aria-label mismatch
  1. Hover the delete icon — tooltip text reads "Delete".
  2. Inspect the icon button's `aria-label` attribute — it should now also show "Delete".

- Autocomplete caret/cursor visibility
  1. Open the combobox (click the input). Select an option such as "Option B".
  2. Click outside the combobox to blur it, then click back into the combobox.
  3. The caret will be visible and positioned at the end of the current input.

## Expected vs Actual before fix

- Before: Tooltip text and the IconButton's `aria-label` differed (visible vs accessible name) — inconsistent for screen reader users. After selecting in Autocomplete and blurring, the caret could disappear or not be visible on re-focus.
- After: Tooltip text and `aria-label` match; the Autocomplete input keeps caret visible and focuses reliably after blur.

## Test details

The tests are automated with Playwright and verify:
- Tooltip visible text and the IconButton aria-label are equal.
- The Autocomplete input's selection/caret range is a valid number after refocusing post-selection.

Notes
- Playwright will download browser binaries on setup. The setup script attempts to install them, but if the install step fails in your environment you can run `npx playwright install` manually.
- The tests run on headless Chromium by default and are written to be cross-platform.

---

If you see any issues running the tests or you want the tests to run in headed mode, open `test-runner.js` and change `headless` for debugging.
