# MUI Bug Fix Project

A comprehensive debugging exercise demonstrating the identification, reproduction, and fix of two critical UI bugs in a Material-UI React application.

---

## 🐛 Bug Descriptions

### Bug 1: Tooltip and aria-label Mismatch (Accessibility/Semantics)

**Component:** Tooltip + IconButton

**Original Issue:**
- The IconButton uses `aria-label="Delete current item"`
- The Tooltip displays `title="Delete"`
- **Problem:** Screen readers announce "Delete current item" while the visible tooltip shows "Delete", creating a mismatch between visible and accessible text.

**Reproduction Steps:**
1. Open the original buggy version in a browser
2. Use a screen reader (NVDA, JAWS, VoiceOver) to navigate to the delete button
3. Observe that the screen reader announces "Delete current item" 
4. Look at the visible tooltip which shows "Delete"
5. Notice the discrepancy between what is spoken and what is shown

**Expected Behavior:**
- Visible tooltip text and aria-label should match exactly
- Screen readers should announce the same text as the tooltip displays

**Applied Fix:**
- Changed `aria-label` from `"Delete current item"` to `"Delete"` to match the tooltip text
- This ensures accessibility layers match the visual UI

---

### Bug 2: Autocomplete Caret/Focus Visibility Issue

**Component:** Autocomplete + TextField

**Original Issue:**
- When the user selects an option and blurs the input, then re-focuses it
- The text caret (cursor) may become invisible or hard to see
- The focus styling may not apply consistently

**Reproduction Steps:**
1. Open the original buggy version in a browser
2. Click on the Autocomplete field
3. Select an option from the dropdown
4. Click outside the field (blur)
5. Click back on the field to refocus
6. Observe that the caret is invisible or difficult to see
7. Type characters - notice caret behavior is inconsistent

**Expected Behavior:**
- Caret should remain visible when the field is focused
- Focus styling should be consistent and clear
- Text input should work smoothly after blur/refocus cycle

**Applied Fix:**
- Added explicit `caretColor` CSS property to the TextField with focus styling
- Added a `focused` state tracker to manage focus state
- Enhanced TextField with focus border styling (`Mui-focused`)
- Ensured controlled state is properly managed without side effects
- Applied sx prop with proper focus handlers for consistent behavior

---

## ✅ Fixes Applied

### Fix 1: Tooltip Accessibility
```javascript
// BEFORE (Buggy)
<Tooltip title="Delete">
  <IconButton aria-label="Delete current item">
    <Icon>delete</Icon>
  </IconButton>
</Tooltip>

// AFTER (Fixed)
<Tooltip title="Delete" data-testid="delete-tooltip">
  <IconButton aria-label="Delete" data-testid="delete-button">
    <Icon>delete</Icon>
  </IconButton>
</Tooltip>
```

### Fix 2: Autocomplete Focus Handling
```javascript
// BEFORE (Buggy - minimal focus styling)
<TextField {...params} label="Pick an option" />

// AFTER (Fixed - explicit caret and focus styling)
<TextField
  {...params}
  label="Pick an option"
  onBlur={(e) => {
    setFocused(false);
    console.log("Autocomplete blur");
  }}
  onFocus={(e) => {
    setFocused(true);
    console.log("Autocomplete focus");
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
        borderWidth: 2,
      },
    },
    "& .MuiOutlinedInput-input": {
      caretColor: "#1976d2",
      "&:focus": {
        caretColor: "#1976d2",
      },
    },
  }}
/>
```

---

## 📋 Project Structure

```
.
├── index.html           # Fixed HTML with React/MUI components
├── input.html           # Original buggy version (reference)
├── package.json         # Project dependencies and scripts
├── setup.js             # Setup script (installs dependencies)
├── test-runner.js       # Cross-platform test runner
└── README.md            # This file
```

---

## 🚀 Quick Start

### 1. Setup (Install Dependencies)

```bash
npm run setup
```

This script will:
- Detect your operating system (Windows, macOS, Linux)
- Install required dependencies from npm
- Prepare the environment for testing

### 2. Run Tests

```bash
npm test
```

This command will:
- Auto-detect your OS
- Run all test suites:
  - **TEST SUITE 1:** Tooltip and aria-label consistency checks
  - **TEST SUITE 2:** Autocomplete focus and caret behavior validation
  - **TEST SUITE 3:** General code quality and structure verification
- Display a summary of passed/failed tests
- Exit with appropriate status code (0 = success, 1 = failure)

---

## 🧪 Test Coverage

### TEST SUITE 1: Tooltip and aria-label Consistency
- ✓ HTML file exists
- ✓ Tooltip component is present
- ✓ Delete button has data-testid
- ✓ Tooltip has correct title attribute
- ✓ IconButton aria-label matches tooltip
- ✓ Old mismatch text is removed

### TEST SUITE 2: Autocomplete Focus and Caret Behavior
- ✓ Autocomplete component is present
- ✓ Autocomplete has data-testid
- ✓ TextField within Autocomplete has data-testid
- ✓ Autocomplete has focus event handler
- ✓ Autocomplete has blur event handler
- ✓ TextField has caret color styling
- ✓ TextField has focus border styling
- ✓ Controlled state is properly managed

### TEST SUITE 3: General Code Quality
- ✓ HTML is valid and well-formed
- ✓ React and MUI libraries are loaded
- ✓ Comments document fixes
- ✓ Page title reflects fixed state
- ✓ Package.json has test script

---

## 💻 Cross-Platform Compatibility

The test runner automatically detects and adapts to:
- **Windows** (PowerShell, Command Prompt)
- **macOS** (Bash, Zsh)
- **Linux** (Bash, Zsh)

All tests run with a single unified command: `npm test`

No OS-specific workarounds needed!

---

## 📖 How to Verify Fixes

### Verify Fix 1 (Tooltip Accessibility)
1. Open `index.html` in a web browser
2. Use browser DevTools to inspect the delete button:
   ```javascript
   // In browser console:
   document.querySelector('[data-testid="delete-button"]').getAttribute('aria-label')
   // Should output: "Delete"
   ```
3. Test with a screen reader:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS)
   - TalkBack (Android/Mobile)

### Verify Fix 2 (Autocomplete Focus)
1. Open `index.html` in a web browser
2. Click on the Autocomplete field
3. Select an option from the dropdown
4. Click outside the field (blur)
5. Click back on the field
6. **Verify:** The text cursor is clearly visible
7. **Verify:** Typing works smoothly
8. Check the focused state in DevTools:
   ```javascript
   // The Autocomplete should show proper focus styling
   document.querySelector('[data-testid="autocomplete-textfield"]')
     .classList.contains('Mui-focused')
   ```

---

## 📦 Dependencies

- **Node.js** (v14+): Runtime for setup and test scripts
- **npm**: Package manager
- **jsdom**: For DOM testing (optional, included in devDependencies)
- **htmlparser2**: For HTML parsing in tests (optional, included in devDependencies)

---

## 🎯 Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Fixed version with both bugs resolved |
| `input.html` | Original buggy version (reference only) |
| `package.json` | Project metadata, dependencies, and scripts |
| `setup.js` | One-command setup that installs dependencies |
| `test-runner.js` | Cross-platform test suite runner |
| `README.md` | This documentation file |

---

## 🔍 Code Comments

The fixed HTML file includes detailed comments explaining:
- What the original bugs were
- How each bug was fixed
- Where fixes are applied in the code
- Why the fixes work

Look for comments marked with:
- `// FIXED:`
- `// FIX 1:` / `// FIX 2:`
- `// FIXES APPLIED:`

---

## ✨ Best Practices Demonstrated

1. **Accessibility First**: Ensure aria-labels match visible text
2. **Consistent State Management**: Use React state properly in controlled components
3. **Explicit Styling**: Make focus states visually clear and functional
4. **Cross-Platform Testing**: Support all major operating systems
5. **Clear Documentation**: Explain what was wrong and how it was fixed
6. **Semantic HTML**: Use proper structure and labels

---

## 📚 Resources

- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Docs - Controlled Components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [Accessibility: Screen Readers](https://www.w3.org/WAI/test-evaluate/access-tools/)

---

## 🐛 Debugging Notes

If you encounter issues:

1. **Tests fail on setup**: Ensure Node.js and npm are installed
   ```bash
   node --version
   npm --version
   ```

2. **HTML doesn't display**: Clear browser cache or open in incognito mode

3. **Caret still invisible**: Check browser zoom level and try a different browser

4. **Screen reader not working**: Install a free screen reader:
   - Windows: NVDA (free) or JAWS
   - macOS: VoiceOver (built-in)
   - Linux: Orca (free)

---

## 📝 Summary

This project demonstrates:
- Identification of real UI/UX bugs
- Implementation of practical fixes
- Comprehensive testing approach
- Cross-platform compatibility
- Accessibility best practices

All bugs have been fixed, tested, and documented. The project is production-ready and serves as a reference for accessibility and UI robustness.

---

**Last Updated:** November 14, 2025  
**Status:** ✅ All bugs fixed and tested
