import { expect, test } from '@playwright/test'

/**
 * M0 smoke suite. The nine specs from Section 14 arrive from M1 onward as the
 * elements they assert against come into existence. This file only proves the
 * harness runs and the three prerendered routes are reachable.
 */
test.describe('M0 scaffold', () => {
  test('/ responds 200 and renders a single h1', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).not.toBeEmpty()
  })

  test('html lang is en-GB (FR-002)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  })

  for (const path of ['/', '/thanks', '/legal']) {
    test(`${path} is prerendered and returns 200`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    })
  }
})
