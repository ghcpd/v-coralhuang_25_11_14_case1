# UI Debugging Challenge

This mini-project demonstrates two accessibility/focus bugs in a standalone Material UI demo. The defects are fixed, documented, and covered by automated tests so the page can serve as a repeatable debugging exercise.

## Documented Bugs

1. **Tooltip vs. aria-label mismatch**  
   - *Reproduction*: Open `input.html`, hover the delete icon. The tooltip text previously said "Delete" while the button's `aria-label` exposed "Delete current item" to assistive tech.  
   - *Impact*: Screen readers announced a name that did not match the visible tooltip, so users heard different instructions than what sighted users saw.  
   - *Fix*: Both the tooltip and the `aria-label` now reference the shared `deleteActionLabel` helper to guarantee identical visible and spoken labels.

2. **Autocomplete caret lost after blur/focus**  
   - *Reproduction*: Choose any option, click outside to blur, then refocus the text field. In the buggy build, Material UI's internal focus handlers were skipped and the controlled `inputValue` ignored blur events, causing the caret to appear missing or jump unpredictably.  
   - *Impact*: Keyboard users could not reliably see where they were typing after returning to the field.  
   - *Fix*: The shared helper `shouldSyncInputValue` now whitelists blur-driven updates so the controlled input stays in sync, and focus/blur callbacks call `restoreCaretOnFocus` while forwarding the original handlers provided by `Autocomplete` so the caret is restored on the next animation frame.

## Files of Interest

- `input.html` – Standalone demo that now imports `app-shared.js` helpers, aligns tooltip semantics, and maintains caret visibility.
- `app-shared.js` – Browser/Node-friendly helpers shared between the UI and the tests.
- `tests/ui-fixes.test.js` – Vitest suite asserting both bug fixes.
- `run-tests.js` – Cross-platform runner that prints the detected OS and executes all checks.
- `setup.sh` – Installs npm dependencies for the project.

## Setup

```bash
./setup.sh
```

The script simply runs `npm install`, which fetches the Vitest dependency.

## Tests (single command)

```bash
npm test
```

`run-tests.js` detects Windows/macOS/Linux, prints the detected OS, and invokes `vitest run --runInBand` so the accessibility and caret-focused tests execute consistently everywhere.

## Expected vs. Actual (before fixes)

| Bug | Expected | Actual |
| --- | --- | --- |
| Tooltip semantics | Both tooltip and `aria-label` announce the same text. | Tooltip said "Delete" while assistive tech read "Delete current item". |
| Autocomplete caret | Caret remains visible at the end of the text after blur/focus cycles. | Caret became invisible or jumped because focus handlers and blur-driven sync were bypassed. |

