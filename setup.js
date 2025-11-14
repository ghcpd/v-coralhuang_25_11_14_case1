#!/usr/bin/env node
/**
 * Setup Script for MUI Bug Fix Challenge
 * 
 * This script prepares the environment by:
 * - Detecting the OS
 * - Installing dependencies (if npm is available)
 * - Creating necessary test fixtures
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const platform = os.platform();
const platformName = 
  platform === 'win32' ? 'Windows' :
  platform === 'darwin' ? 'macOS' :
  platform === 'linux' ? 'Linux' :
  'Unknown';

console.log(`\n✓ Detected OS: ${platformName}\n`);

// Check if npm is available
let hasNpm = false;
try {
  execSync('npm --version', { stdio: 'pipe' });
  hasNpm = true;
  console.log('✓ npm is available');
} catch (e) {
  console.log('⚠ npm not found. Skipping dependency installation.');
  console.log('  You can manually run: npm install');
}

// Create test fixtures directory if needed
const fixturesDir = path.join(__dirname, 'fixtures');
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
  console.log(`✓ Created fixtures directory: ${fixturesDir}`);
}

// Create a simple HTML test fixture for DOM testing
const testFixturePath = path.join(fixturesDir, 'test-fixture.html');
if (!fs.existsSync(testFixturePath)) {
  const fixtureContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Test Fixture</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  
  fs.writeFileSync(testFixturePath, fixtureContent, 'utf8');
  console.log(`✓ Created test fixture: ${testFixturePath}`);
}

if (hasNpm) {
  try {
    console.log('\n📦 Installing dependencies...\n');
    execSync('npm install', { stdio: 'inherit' });
    console.log('\n✓ Dependencies installed successfully');
  } catch (e) {
    console.error('✗ Failed to install dependencies');
    process.exit(1);
  }
}

console.log('\n✓ Setup complete! You can now run tests with: npm test\n');
