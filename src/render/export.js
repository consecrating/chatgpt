/**
 * PNG EXPORT
 *
 * Loads the rendered HTML in a headless Chromium (via Playwright) and screenshots
 * the exact canvas element, producing a pixel-perfect Instagram-ready PNG.
 */

import { chromium } from "playwright";

/**
 * @param {string} html   full HTML document from renderHTML()
 * @param {object} opts   { width, height, outPath, scale }
 */
export async function htmlToPng(html, { width, height, outPath, scale = 1 }) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: scale,
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    // Give web fonts a moment to settle so text is measured at final size.
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(250);
    const el = await page.$("#canvas");
    await el.screenshot({ path: outPath });
    return outPath;
  } finally {
    await browser.close();
  }
}
