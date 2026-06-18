// Visual smoke test for docs/home.html
//
// Loads the static file via file:// URL, waits for fonts, asserts that
// key page elements actually rendered (per CLAUDE.md Rule #6 — a screenshot
// of a blank page is worse than no screenshot), then captures a full-page
// PNG to tests/screenshots/ for Claude to Read.

import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const homeUrl = pathToFileURL(path.resolve('docs/home.html')).href;

test('home page renders', async ({ page }, testInfo) => {
  await page.goto(homeUrl);

  // Wait until web fonts are loaded so the screenshot is consistent.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);

  // Content assertions — fail loudly if the page rendered blank
  // (e.g. broken </style> consuming the whole body, missing root container).
  await expect(page.locator('body')).not.toBeEmpty();
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.nav')).toBeVisible();
  await expect(page.locator('.pcard')).toHaveCount(6);     // small product grid
  await expect(page.locator('.icard')).toHaveCount(4);     // industries
  // (testimonials carousel + logo marquee removed)

  const file = `tests/screenshots/home-${testInfo.project.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Screenshot → ${file}`);
});
