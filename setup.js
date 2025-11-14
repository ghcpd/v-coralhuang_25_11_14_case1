import { spawnSync } from 'child_process';
import os from 'os';

console.log(`Detected platform: ${os.platform()}`);
console.log('Installing npm dependencies (this may take a moment)...');
// npm ci is preferred in CI, fallback to npm install locally
let install = spawnSync('npm', ['ci'], { stdio: 'inherit', shell: true });
if (install.status !== 0) {
  console.warn('npm ci failed, falling back to npm install...');
  install = spawnSync('npm', ['install'], { stdio: 'inherit', shell: true });
  if (install.status !== 0) {
    console.error('npm install failed. Please run the setup commands manually: npm install');
    process.exit(install.status || 1);
  }
}

console.log('Installing Playwright browsers...');
const playwrightInstall = spawnSync('npx', ['playwright', 'install', '--with-deps'], { stdio: 'inherit', shell: true });
if (playwrightInstall.status !== 0) {
  console.error('Failed to install Playwright browsers automatically. Try running: npx playwright install');
  process.exit(playwrightInstall.status || 1);
}

console.log('Setup complete. You can now run `npm test`.');
