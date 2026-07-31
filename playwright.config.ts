import { defineConfig, devices } from '@playwright/test'

// Section 14 runs the suite against a Vercel preview URL in CI. Locally,
// `pnpm verify` must be self-sufficient, so BASE_URL falls back to a
// `nuxt preview` server started by Playwright. See DECISIONS.md.
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Capped at 2. Headless Firefox on Windows falls back to the SWGL software
  // compositor; at 4 workers an axe scan that takes 7s in isolation exceeded
  // 60s. Wall-clock traded for a suite that means something.
  workers: 2,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  // Firefox under parallel load on a laptop exceeds the 30s default while
  // smooth-scrolling a tall page; the same specs pass in isolation. Raised
  // rather than reducing coverage.
  timeout: 60_000,

  expect: {
    timeout: 10_000,
    // 02-responsive: full page screenshot comparison, 0.2% pixel tolerance.
    toHaveScreenshot: { maxDiffPixelRatio: 0.002 },
  },

  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Only start a local server when not pointed at a deployed URL.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm preview',
        url: baseURL,
        // Never reuse. `pnpm verify` builds immediately before this runs, so a
        // server left over from an earlier build would silently serve stale
        // output -- which it did, hiding a title fix. See DECISIONS.md.
        reuseExistingServer: false,
        timeout: 120_000,
      },
})
