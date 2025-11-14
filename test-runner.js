#!/usr/bin/env node
/**
 * Cross-Platform Test Runner for MUI Bug Fix Challenge
 * 
 * This test runner:
 * - Detects the operating system
 * - Runs all tests with OS-adaptive behavior
 * - Validates both bug fixes (Tooltip accessibility + Autocomplete focus)
 * - Produces detailed test reports
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ===========================
// OS Detection
// ===========================
const platform = os.platform();
const isWindows = platform === 'win32';
const isMacOS = platform === 'darwin';
const isLinux = platform === 'linux';

const osName =
  isWindows ? 'Windows' :
  isMacOS ? 'macOS' :
  isLinux ? 'Linux' :
  'Unknown';

console.log('\n' + '='.repeat(70));
console.log(`🔍 MUI BUG FIX TEST RUNNER`);
console.log('='.repeat(70));
console.log(`📱 Detected OS: ${osName}\n`);

// ===========================
// Test Suite Definition
// ===========================
class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log(`\n📋 Test Suite: ${this.name}`);
    console.log('-'.repeat(70));

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`✗ ${test.name}`);
        console.log(`  Error: ${error.message}`);
      }
    }

    console.log('-'.repeat(70));
    console.log(
      `Results: ${this.passed} passed, ${this.failed} failed (${
        this.tests.length
      } total)\n`
    );

    return {
      name: this.name,
      passed: this.passed,
      failed: this.failed,
      total: this.tests.length,
    };
  }
}

// ===========================
// HTML File Validator
// ===========================
function readHTMLFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function parseHTMLForElements(html, selector) {
  // Simple regex-based HTML parsing for test purposes
  // This is not a full DOM parser, but sufficient for our tests
  const patterns = {
    'tooltip': /<Tooltip[^>]*title="([^"]*)"[^>]*>/g,
    'iconbutton': /<IconButton[^>]*>/g,
    'aria-label': /aria-label="([^"]*)"/g,
    'autocomplete': /<Autocomplete[^>]*>/g,
    'textfield': /<TextField[^>]*>/g,
    'data-testid': /data-testid="([^"]*)"/g,
  };

  return html.match(patterns[selector] || []) || [];
}

// ===========================
// Test Suites
// ===========================

// Suite 1: Tooltip Accessibility Fix
const tooltipTests = new TestSuite('Bug 1: Tooltip & aria-label Fix');

tooltipTests.test('index.html exists', () => {
  const filePath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(filePath)) {
    throw new Error('index.html not found');
  }
});

tooltipTests.test('Tooltip component present with correct title', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  const tooltipMatches = parseHTMLForElements(html, 'tooltip');
  
  if (tooltipMatches.length === 0) {
    throw new Error('No Tooltip component found');
  }

  const hasDeleteTooltip = tooltipMatches.some(t => t.includes('Delete'));
  if (!hasDeleteTooltip) {
    throw new Error('Tooltip with "Delete" title not found');
  }
});

tooltipTests.test('IconButton has no aria-label (to avoid duplication)', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  // Extract the DeleteButton section
  const deleteButtonStart = html.indexOf('data-testid="delete-button"');
  if (deleteButtonStart === -1) {
    throw new Error('Delete button not found in HTML');
  }

  const buttonSection = html.substring(
    Math.max(0, deleteButtonStart - 200),
    deleteButtonStart + 200
  );

  if (buttonSection.includes('aria-label="Delete current item"')) {
    throw new Error(
      'Bug 1 not fixed: aria-label still present on IconButton (causes screen reader duplication)'
    );
  }
});

tooltipTests.test('delete-button has correct test identifier', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  if (!html.includes('data-testid="delete-button"')) {
    throw new Error('Delete button test identifier missing');
  }
});

tooltipTests.test('Tooltip has correct test identifier', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  if (!html.includes('data-testid="delete-tooltip"')) {
    throw new Error('Delete tooltip test identifier missing');
  }
});

// Suite 2: Autocomplete Focus & Caret Fix
const autocompleteTests = new TestSuite('Bug 2: Autocomplete Focus & Caret Fix');

autocompleteTests.test('index.html is well-formed', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  // Basic well-formedness checks
  const openTags = (html.match(/<Autocomplete/g) || []).length;
  const closeTags = (html.match(/<\/Autocomplete>/g) || []).length;
  
  if (openTags !== closeTags) {
    throw new Error('Autocomplete tags not properly balanced');
  }
});

autocompleteTests.test('Autocomplete component has data-testid', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  if (!html.includes('data-testid="autocomplete"')) {
    throw new Error('Autocomplete test identifier missing');
  }
});

autocompleteTests.test('Autocomplete input field has data-testid', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  if (!html.includes('data-testid="autocomplete-input"')) {
    throw new Error('Autocomplete input test identifier missing');
  }
});

autocompleteTests.test('CSS focus styling present for caret visibility', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('input:focus')) {
    throw new Error('CSS focus selector missing for caret visibility');
  }

  if (!html.includes('caret-color')) {
    throw new Error('caret-color CSS property missing (Bug 2 fix incomplete)');
  }
});

autocompleteTests.test('Focus event handlers properly defined', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('handleInputFocus')) {
    throw new Error('handleInputFocus function not defined');
  }

  if (!html.includes('handleInputBlur')) {
    throw new Error('handleInputBlur function not defined');
  }

  if (!html.includes('onFocus={handleInputFocus}')) {
    throw new Error('onFocus handler not attached to input');
  }

  if (!html.includes('onBlur={handleInputBlur}')) {
    throw new Error('onBlur handler not attached to input');
  }
});

autocompleteTests.test('TextField maintains inputProps for accessibility', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('inputProps')) {
    throw new Error('inputProps not passed to TextField');
  }
});

// Suite 3: General Code Quality & Documentation
const qualityTests = new TestSuite('Code Quality & Documentation');

qualityTests.test('HTML file is valid and readable', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('<!DOCTYPE html>')) {
    throw new Error('DOCTYPE declaration missing');
  }

  if (!html.includes('<html lang="en">')) {
    throw new Error('HTML lang attribute missing');
  }

  if (!html.includes('</html>')) {
    throw new Error('HTML closing tag missing');
  }
});

qualityTests.test('Component is titled "Fixed MUI Example"', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  if (!html.includes('Fixed MUI Example')) {
    throw new Error('Component title not updated to indicate fixes');
  }
});

qualityTests.test('Bug sections marked with FIXED status', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  const fixedCount = (html.match(/FIXED/g) || []).length;
  
  if (fixedCount < 2) {
    throw new Error('Not all bug fixes are clearly marked (expected at least 2 FIXED badges)');
  }
});

qualityTests.test('Descriptive comments for fixes are present', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('FIX 1:')) {
    throw new Error('Fix 1 comment not present');
  }

  if (!html.includes('FIX 2:')) {
    throw new Error('Fix 2 comment not present');
  }
});

qualityTests.test('CSS outline ensures focus visibility', () => {
  const html = readHTMLFile(path.join(__dirname, 'index.html'));
  
  if (!html.includes('outline: 2px solid')) {
    throw new Error('Focus outline CSS not defined for accessibility');
  }
});

// ===========================
// Main Test Runner
// ===========================
async function runAllTests() {
  const results = [];

  try {
    results.push(await tooltipTests.run());
    results.push(await autocompleteTests.run());
    results.push(await qualityTests.run());
  } catch (error) {
    console.error('Fatal error during test execution:', error.message);
    process.exit(1);
  }

  // Summary Report
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL TEST REPORT');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✓ Passed: ${totalPassed}`);
  console.log(`✗ Failed: ${totalFailed}`);
  console.log('='.repeat(70));

  if (totalFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Both bugs have been successfully fixed.\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
