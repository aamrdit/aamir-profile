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
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  expect: {
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
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
})
