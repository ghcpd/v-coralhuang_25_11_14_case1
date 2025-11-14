const puppeteer = require("puppeteer");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const indexPath = path.resolve(__dirname, "../index.html");
    const pageUrl = pathToFileURL(indexPath).href;

    await page.goto(pageUrl, { waitUntil: "networkidle0" });

    const tooltipButtonSelector = "button[aria-label]";
    await page.waitForSelector(tooltipButtonSelector);

    const tooltipLabel = await page.$eval(
      tooltipButtonSelector,
      (button) => button.getAttribute("aria-label")
    );

    const expectedTooltipLabel = "Delete current item";
    if (tooltipLabel !== expectedTooltipLabel) {
      throw new Error(
        `Tooltip label mismatch: expected "${expectedTooltipLabel}", but found "${tooltipLabel}"`
      );
    }

    const inputSelector = "input";
    await page.waitForSelector(inputSelector);

    await page.click(inputSelector);
    await page.keyboard.type("Option");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(200);
    await page.mouse.click(0, 0);
    await page.waitForTimeout(100);

    await page.click(inputSelector);
    await page.waitForTimeout(100);

    const selectionStart = await page.$eval(
      inputSelector,
      (node) => node.selectionStart
    );
    const valueLength = await page.$eval(
      inputSelector,
      (node) => node.value.length
    );

    if (selectionStart !== valueLength) {
      throw new Error(
        `Caret repositioning failed: expected selectionStart === value.length (${valueLength}), got ${selectionStart}`
      );
    }
  } finally {
    await browser.close();
  }
})();
