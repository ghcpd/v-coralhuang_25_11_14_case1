/**
 * Cross-platform test runner for the UI debugging exercise.
 * - Starts a minimal static HTTP server that serves input.html at '/'
 * - Runs Puppeteer tests to validate the fixes
 * - Prints OS information and exits with code 0 on success or 1 on failure
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '127.0.0.1';
const rootDir = __dirname;

function detectOS() {
  const plat = process.platform;
  if (plat === 'win32') return 'Windows';
  if (plat === 'darwin') return 'macOS';
  if (plat === 'linux') return 'Linux';
  return plat;
}

async function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url;
    if (reqPath === '/' || reqPath === '/index.html') {
      reqPath = '/input.html';
    }
    const filePath = path.join(rootDir, decodeURIComponent(reqPath));
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found: ' + filePath);
      }
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === '.html' ? 'text/html' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(PORT, HOST, (err) => {
      if (err) return reject(err);
      resolve(server);
    });
  });
}

async function runTests() {
  console.log('Detected OS:', detectOS());

  const server = await startServer();
  console.log(`Server started at http://${HOST}:${PORT}/`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);

    const rootUrl = `http://${HOST}:${PORT}/`;
    await page.goto(rootUrl);

    // Test 1: Tooltip & aria-label semantic match
    console.log('Running Test 1: Tooltip & aria-label match');
    const iconSelector = 'button[aria-label="Delete"]';
    await page.waitForSelector(iconSelector, { visible: true });
    const ariaLabel = await page.$eval(iconSelector, (el) => el.getAttribute('aria-label'));
    if (ariaLabel !== 'Delete') {
      throw new Error(`Icon aria-label mismatch: expected 'Delete', got '${ariaLabel}'`);
    }

    // Hover to show tooltip (MUI uses role="tooltip")
    await page.hover(iconSelector);
    await page.waitForSelector('[role="tooltip"]', { visible: true });
    const tooltipText = await page.$eval('[role="tooltip"]', (el) => el.textContent && el.textContent.trim());
    if (tooltipText !== 'Delete') {
      throw new Error(`Tooltip text mismatch: expected 'Delete', got '${tooltipText}'`);
    }
    console.log('Test 1 passed.');

    // Test 2: Autocomplete caret/focus behavior
    console.log('Running Test 2: Autocomplete caret / focus behavior');

    // The page contains a single TextField input for the autocomplete.
    const inputSelector = '.MuiAutocomplete-root input';

    await page.waitForSelector(inputSelector, { visible: true });
    const input = await page.$(inputSelector);

    // Focus input and open dropdown (Arrow Down) to reveal options
    await input.click({ clickCount: 1 });
    await page.keyboard.press('ArrowDown');

    // Wait for the options popper and click the 'Option C' item (text)
    await page.waitForSelector('[role="option"]', { visible: true });
    const optionNodes = await page.$$('[role="option"]');
    let targetOptionHandle = null;
    for (const handle of optionNodes) {
      const text = await (await handle.getProperty('textContent')).jsonValue();
      if ((text || '').trim() === 'Option C') {
        targetOptionHandle = handle;
        break;
      }
    }
    if (!targetOptionHandle) {
      throw new Error('Option C not found in autocomplete list');
    }
    await targetOptionHandle.click();

    // Ensure input value updated
    const valueAfter = await page.$eval(inputSelector, (el) => el.value);
    if (valueAfter !== 'Option C') {
      throw new Error(`After selection, input value is not 'Option C': got '${valueAfter}'`);
    }

    // Blur and refocus
    await page.click('body');
    await page.waitForTimeout(100);
    await input.focus();

    // Confirm caret/selection is at end of text (not collapsed weirdly)
    const selectionStart = await page.evaluate((el) => el.selectionStart, input);
    const selectionEnd = await page.evaluate((el) => el.selectionEnd, input);

    // Ensure the caret is at the end (cursor visible and ready for typing) or selectionStart equals selectionEnd
    if (selectionStart !== (valueAfter ? valueAfter.length : 0)) {
      throw new Error(`Caret position is not at the end after refocus: selectionStart=${selectionStart}, expected=${valueAfter.length}`);
    }

    // Type X to confirm appending text works
    await page.keyboard.type('X');
    const finalValue = await page.$eval(inputSelector, (el) => el.value);
    if (finalValue !== 'Option CX') {
      throw new Error(`Typing after refocus didn't append correctly: got '${finalValue}'`);
    }

    console.log('Test 2 passed.');

    console.log('All tests passed.');
    await browser.close();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('One or more tests failed:', err);
    if (browser) await browser.close();
    server.close();
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
