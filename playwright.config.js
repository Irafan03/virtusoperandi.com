// Playwright config — visual verification of static docs/ pages
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    headless: false,         // headed by default so the run is visible
    viewport: { width: 1440, height: 900 },
    screenshot: 'on',
    // No baseURL — tests navigate to file:// URLs directly so no dev server is required.
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // Phone viewport on Chromium (avoids needing WebKit install)
    { name: 'mobile',  use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
});
