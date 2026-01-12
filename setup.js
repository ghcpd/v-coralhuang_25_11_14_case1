#!/usr/bin/env node

/**
 * Setup Script
 * Installs dependencies for the bug-fix project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up MUI Bug Fix Project...\n');

// Detect OS
const platform = process.platform;
let osName = 'Unknown';
if (platform === 'win32') osName = 'Windows';
else if (platform === 'darwin') osName = 'macOS';
else if (platform === 'linux') osName = 'Linux';

console.log(`📊 Detected OS: ${osName}\n`);

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✓ node_modules already exists. Dependencies appear to be installed.\n');
} else {
  console.log('📦 Installing npm dependencies...\n');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('\n✓ Dependencies installed successfully.\n');
  } catch (error) {
    console.error('✗ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

console.log('✓ Setup complete! You can now run tests with: npm test\n');
