# MUI Debug Challenge

This project documents and fixes two accessibility/focus issues that were intentionally present in the starter HTML file. The page now renders a tooltip-wrapped delete button and a controlled autocomplete input that keeps the caret visible after blur.

## Bug 1 — Tooltip vs. `aria-label`
- **Reproduction**: Hover or focus the delete icon button and listen for the tooltip text, then inspect the same button with a screen reader (or a DOM inspector) to check the `aria-label`. Previously the tooltip said “Delete” while the `aria-label` read “Delete current item”.
- **Actual vs. Expected**: Actual text mismatch could confuse assistive technology. Expected both the tooltip and the accessible name share the same text.
- **Fix Summary**: The tooltip title and the `IconButton`’s `aria-label` are now built from the shared `deleteActionLabel` constant (`"Delete current item"`), ensuring the visible label matches the spoken label.

## Bug 2 — Autocomplete caret after blur
- **Reproduction**: Select an option from the autocomplete, click away (blur), then click the input again. Before the fix the caret/cursor often did not reappear or sat in the wrong place when re-focusing the input.
- **Actual vs. Expected**: Actual behavior hid the caret, making typing feel broken. Expected behavior keeps the caret visible at the end of the current text.
- **Fix Summary**: The autocomplete’s text field now exposes an `inputRef` and the `moveCaretToEnd` helper forces the selection to the end of the string whenever the input regains focus.

## Project setup
1. Ensure Node.js (v16+) is installed.
2. Run `npm run setup` (or `node setup.js`) once to install dependencies.

## Running the tests
- Run `npm test`. The `test-runner.js` script prints the detected OS and executes both Puppeteer checks:
  1. Tooltip `aria-label` matches the visible label.
  2. After selecting an autocomplete option, blurring, and refocusing, the caret returns to the end of the text.

The tests are cross-platform and rely on Puppeteer to drive the bundled `index.html` file via a `file://` URL.
