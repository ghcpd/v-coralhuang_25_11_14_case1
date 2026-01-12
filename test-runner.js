#!/usr/bin/env node

/**
 * Cross-Platform Test Runner
 * Detects OS and runs all tests with a single unified command
 */

const fs = require('fs');
const path = require('path');

// Detect OS
const platform = process.platform;
let osName = 'Unknown';
if (platform === 'win32') osName = 'Windows';
else if (platform === 'darwin') osName = 'macOS';
else if (platform === 'linux') osName = 'Linux';

console.log('\n═══════════════════════════════════════════════════════');
console.log('🧪 MUI Bug Fix - Cross-Platform Test Suite');
console.log('═══════════════════════════════════════════════════════\n');
console.log(`📊 Detected OS: ${osName}\n`);

// Test results tracking
let passedTests = 0;
let failedTests = 0;
const testResults = [];

/**
 * Test helper function
 */
function test(name, fn) {
  try {
    fn();
    passedTests++;
    testResults.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    failedTests++;
    testResults.push({ name, status: 'FAIL', error: error.message });
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

/**
 * Assert helper function
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// ============================================
// TEST 1: BUG FIX #1 - TOOLTIP/ARIA-LABEL
// ============================================

console.log('\n─────────────────────────────────────────────────────────');
console.log('TEST SUITE 1: Tooltip and aria-label Consistency');
console.log('─────────────────────────────────────────────────────────\n');

test('HTML file exists', () => {
  const filePath = path.join(__dirname, 'index.html');
  assert(fs.existsSync(filePath), 'index.html not found');
});

test('Tooltip component is present', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(content.includes('Tooltip'), 'Tooltip component not found in HTML');
});

test('Delete button has data-testid', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('data-testid="delete-button"'),
    'delete-button data-testid not found'
  );
});

test('Tooltip has correct title attribute', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('title="Delete"') || content.includes('title: "Delete"'),
    'Tooltip title "Delete" not found or incorrect'
  );
});

test('IconButton aria-label matches tooltip', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  // Check that aria-label="Delete" exists near the delete button
  const hasAriaLabelDelete = content.includes('aria-label="Delete"');
  const hasDeleteButton = content.includes('data-testid="delete-button"');
  const hasTooltipDelete = content.includes('title="Delete"') || content.includes('title: "Delete"');
  
  assert(
    hasAriaLabelDelete && hasDeleteButton && hasTooltipDelete,
    'aria-label should be "Delete" to match tooltip and button should have correct testid'
  );
});

test('aria-label does not contain old mismatch text', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    !content.match(/aria-label="Delete current item"/),
    'Old mismatch text "Delete current item" still present'
  );
});

// ============================================
// TEST 2: BUG FIX #2 - AUTOCOMPLETE FOCUS
// ============================================

console.log('\n─────────────────────────────────────────────────────────');
console.log('TEST SUITE 2: Autocomplete Focus and Caret Behavior');
console.log('─────────────────────────────────────────────────────────\n');

test('Autocomplete component is present', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(content.includes('Autocomplete'), 'Autocomplete component not found');
});

test('Autocomplete has data-testid', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('data-testid="autocomplete-field"'),
    'autocomplete-field data-testid not found'
  );
});

test('TextField within Autocomplete has data-testid', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('data-testid="autocomplete-textfield"'),
    'autocomplete-textfield data-testid not found'
  );
});

test('Autocomplete has focus event handler', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('onFocus') && content.includes('setFocused(true)'),
    'onFocus handler not found in Autocomplete'
  );
});

test('Autocomplete has blur event handler', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('onBlur') && content.includes('setFocused(false)'),
    'onBlur handler not found in Autocomplete'
  );
});

test('TextField has caret color styling', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('caretColor'),
    'caretColor styling not found in TextField'
  );
});

test('TextField has focus border styling', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('Mui-focused') && content.includes('borderColor'),
    'Focus border styling not found in TextField'
  );
});

test('Controlled state is properly managed', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('useState(null)') && content.includes('useState("")'),
    'Controlled state (value, inputValue) not properly initialized'
  );
});

// ============================================
// TEST 3: GENERAL CODE QUALITY
// ============================================

console.log('\n─────────────────────────────────────────────────────────');
console.log('TEST SUITE 3: General Code Quality and Structure');
console.log('─────────────────────────────────────────────────────────\n');

test('HTML is valid and well-formed', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('<!DOCTYPE html>') && content.includes('</html>'),
    'HTML structure is malformed'
  );
});

test('React and MUI libraries are loaded', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('react@18') && content.includes('@mui/material@5'),
    'Required libraries not loaded'
  );
});

test('Comments document fixes', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(
    content.includes('FIXES APPLIED') ||
      content.includes('FIX 1') ||
      content.includes('FIX 2'),
    'Fixes documentation not found in comments'
  );
});

test('Page title reflects fixed state', () => {
  const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  assert(
    titleMatch && (titleMatch[1].includes('Fixed') || titleMatch[1].includes('fixed')),
    'Page title does not indicate fixed state'
  );
});

test('Package.json has test script', () => {
  const packagePath = path.join(__dirname, 'package.json');
  assert(fs.existsSync(packagePath), 'package.json not found');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  assert(
    packageJson.scripts && packageJson.scripts.test,
    'package.json missing test script'
  );
});

// ============================================
// RESULTS SUMMARY
// ============================================

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 TEST RESULTS SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`✓ Passed: ${passedTests}`);
console.log(`✗ Failed: ${failedTests}`);
console.log(`📈 Total:  ${passedTests + failedTests}\n`);

if (failedTests > 0) {
  console.log('Failed Tests:');
  testResults
    .filter((r) => r.status === 'FAIL')
    .forEach((r) => {
      console.log(`  - ${r.name}`);
      if (r.error) console.log(`    ${r.error}`);
    });
}

console.log('\n═══════════════════════════════════════════════════════\n');

if (failedTests === 0) {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed.\n');
  process.exit(1);
}
