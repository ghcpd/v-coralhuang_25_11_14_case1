// Lightweight setup script that installs dependencies.
// Cross-platform: Node script (works on Windows/macOS/Linux)
const { execSync } = require('child_process');

console.log('Running setup: installing npm dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('Setup complete.');
} catch (err) {
  console.error('Setup failed:', err);
  process.exit(1);
}
