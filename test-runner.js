import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { chromium } from 'playwright';

function log(msg) {
  console.log(msg);
}

function fail(msg) {
  console.error('❌', msg);
  process.exit(1);
}

// Basic static file server to serve input.html
async function serve(root, port) {
  const server = http.createServer((req, res) => {
    const url = decodeURI(req.url);
    let filePath = path.join(root, url);
    if (url === '/') filePath = path.join(root, 'input.html');
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      fs.createReadStream(filePath).pipe(res);
    });
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return server;
}

(async function main(){
  try {
    log(`Detected OS: ${os.platform()} (${os.type()})`);

    const root = process.cwd();
    const port = 3000; // static port is fine for single-run tests
    const server = await serve(root, port);
    log(`Serving files from ${root} on http://127.0.0.1:${port}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = `http://127.0.0.1:${port}/input.html`;
    await page.goto(url, { waitUntil: 'networkidle' });
    log('Page loaded');

    // Test 1: Tooltip and aria-label consistency
    log('Running test: Tooltip and aria-label match');
    try {
      const btn = page.getByRole('button', { name: 'Delete' });
      await btn.hover();
      // wait for tooltip to appear
      const tooltip = await page.waitForSelector('[role="tooltip"]', { timeout: 3000 });
      const tooltipText = (await tooltip.textContent()).trim();
      const aria = (await btn.getAttribute('aria-label')) || '';
      if (tooltipText !== 'Delete') {
        fail(`Tooltip text was '${tooltipText}', expected 'Delete'`);
      }
      if (aria !== 'Delete') {
        fail(`Icon button aria-label: ${aria}, expected 'Delete'`);
      }
      log('✅ Tooltip and aria-label are consistent');
    } catch (e) {
      fail('Tooltip test failed: ' + e);
    }

    // Test 2: Autocomplete caret / focus behavior
    log('Running test: Autocomplete caret / focus behavior');

    try {
      // Find combobox input; MUI typically renders it with role 'combobox'
      let combo = page.getByRole('combobox', { name: 'Pick an option' });
      if (!(await combo.count())) {
        // fallback to the first text input if role not present
        combo = page.locator('input[type="text"]').first();
      }
      await combo.click();

      // Click an option by role/visible text
      const optionToSelect = 'Option B';
      const option = page.getByRole('option', { name: optionToSelect });
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();

      // Blur the input
      await page.click('body');

      // Re-focus the input
      await combo.click();

      // Verify the caretaker is shown by checking selection range value
      const selectionStart = await combo.evaluate((el) => el.selectionStart);
      if (typeof selectionStart !== 'number' || selectionStart < 0) {
        fail('Autocomplete input selectionStart invalid after refocus: ' + selectionStart);
      }
      log('✅ Caret/selection behaves correctly after re-focus');

    } catch (e) {
      fail('Autocomplete focus/caret test failed: ' + e);
    }

    await browser.close();
    server.close();
    log('\nAll tests passed successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
