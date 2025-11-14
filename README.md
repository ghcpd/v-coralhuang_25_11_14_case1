# Bug Fix: Tooltip aria-label & Autocomplete caret fix

This project contains a small HTML/JS example that originally showcased two UI bugs. I've fixed the bugs and added tests and a simple setup/test runner.

## Bugs (original)

1. Tooltip and aria-label mismatch
   - Components: `Tooltip` + `IconButton` (MUI)
   - Description: The `IconButton` used an `aria-label` that differed from the visible tooltip text. Screen readers could announce a different text than what is visible.

2. Autocomplete caret / focus issue
   - Components: `Autocomplete` + `TextField` (MUI)
   - Description: After selecting an option, blurring, and re-focusing the input, the caret could be invisible or not at the expected position. This was due to how the `inputValue` state was updated.

## Reproduction steps (before the fix)

1. Open `input.html` in a browser.
2. Hover over the Delete icon — tooltip shows "Delete", but the `aria-label` read by the screen reader was "Delete current item".
3. Use the Autocomplete: click the input, select an item (e.g., "Option C"), blur the input, then refocus — the caret might not appear at the end.

## What I changed

1. Tooltip accessibility
   - Matched the `IconButton`'s `aria-label` with the Tooltip's visible text (`Delete`). This prevents mismatch between what sighted users see and what screen readers announce.

2. Autocomplete caret & focus behavior
   - When the user selects an option, the `inputValue` is now explicitly set to the selected option via `onChange` synchronization.
   - `onInputChange` now updates the input value only for `input` and `clear` reasons, and not for `reset`.
   - `inputProps` style now sets `caretColor: 'black'` to ensure the caret remains visible in different environments.

## Files added

- `input.html` — fixed UI file (main file)
- `package.json` — includes test and setup scripts
- `setup.js` — run `node setup.js` to install dependencies
- `test-runner.js` — a single cross-platform test runner that starts a small HTTP server and runs Puppeteer-based UI tests
- `README.md` — this document

## How to run

1. Setup (installs dependencies):

   - Windows/macOS/Linux:
     - Node.js (>=16) is required
     - Run: `node setup.js` or `npm run setup`

2. Run tests:

   - `npm test` or `node test-runner.js`
     - This will:
       - Detect and print the platform
       - Start a tiny HTTP server serving `input.html`
       - Launch a headless Chromium and run two UI tests:
         - Tooltip aria-label & visible text match
         - Autocomplete selection, blur, refocus, caret visibility and typing

## Notes and compatibility

- Tests use Puppeteer and a minimal Node static server — these are cross-platform.
- If you run into Puppeteer installation issues (e.g., missing libs on Linux), install the OS-specific dependencies (Puppeteer docs): https://pptr.dev/
- The fix for the tooltip was intentionally minimal: matching `aria-label` with visual text is generally the correct approach for simple icons with tooltips.
- For more complex accessible names, you can use `aria-labelledby` to point to a visible text element.

## 🎯 Summary
- Fixed tooltip/aria-label mismatch (consistent text for sighted and screen reader users)
- Fixed autocomplete caret/focus issue by keeping `inputValue` in sync and ensuring caret color visibility
- Added tests and a single runner that works cross-platform

Happy debugging! 🎉
