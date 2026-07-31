import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

async function scan(page: Page) {
  return new AxeBuilder({ page }).withTags(TAGS).analyze()
}

function describeViolations(violations: Awaited<ReturnType<typeof scan>>['violations']) {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target).join('\n  ')}`)
    .join('\n\n')
}

test.describe('accessibility', () => {
  // The bar is zero violations, not zero critical (Section 18).
  test('default state has zero violations', async ({ page }) => {
    await page.goto('/')
    const { violations } = await scan(page)
    expect(violations, describeViolations(violations)).toEqual([])
  })

  test('mobile menu overlay open has zero violations', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByTestId('nav-menu-trigger')
    if (!(await trigger.isVisible())) test.skip(true, 'overlay exists below 1024px only')

    await trigger.click()
    await expect(page.getByTestId('nav-menu-overlay')).toBeVisible()

    const { violations } = await scan(page)
    expect(violations, describeViolations(violations)).toEqual([])
  })

  for (const path of ['/legal', '/thanks']) {
    test(`${path} has zero violations`, async ({ page }) => {
      await page.goto(path)
      const { violations } = await scan(page)
      expect(violations, describeViolations(violations)).toEqual([])
    })
  }

  // FAQ lands at M5; the failed-validation state lands at M6. Both are named in
  // Section 2's five page states and are added with the features they cover.
  test.fixme('all FAQ items expanded has zero violations', async () => {})
  test.fixme('failed form validation has zero violations', async () => {})

  test('html lang is en-GB (FR-002)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  })

  test('exactly one h1 and no skipped heading levels (FR-003)', async ({ page }) => {
    await page.goto('/')
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])))

    expect(levels.filter((level) => level === 1)).toHaveLength(1)
    expect(levels[0]).toBe(1)

    for (let i = 1; i < levels.length; i += 1) {
      const step = levels[i]! - levels[i - 1]!
      expect(step, `heading level jumped from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1)
    }
  })

  test('focus order matches DOM order and focus stays visible', async ({
    page,
    browserName,
  }) => {
    // See 04-navigation: WebKit will not Tab to links without full keyboard
    // access. Covered manually on real Safari per Section 16.
    test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default')

    await page.goto('/')

    // Tab until focus cycles back to the first element. Wrapping is normal, so
    // the assertion is that no element repeats WITHIN one cycle -- pressing a
    // fixed number of times and forbidding all repeats would fail on any page
    // with fewer focusable elements than presses.
    const seen: string[] = []
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        return {
          key: `${el.tagName}:${el.getAttribute('data-testid') ?? el.textContent?.trim().slice(0, 24) ?? ''}`,
          visible: el.offsetWidth > 0 || el.offsetHeight > 0,
        }
      })
      if (!info) break
      // Chromium wraps to the first element; headless Firefox parks on the
      // last one instead of handing focus to browser chrome. Both mean the
      // cycle is done.
      if (seen.length > 0 && info.key === seen[0]) break
      if (seen.length > 0 && info.key === seen[seen.length - 1]) break
      expect(info.visible, `${info.key} is focused but not visible`).toBe(true)
      seen.push(info.key)
    }

    expect(seen.length).toBeGreaterThan(3)
    expect(
      new Set(seen).size,
      `an element was focused twice in one cycle: ${seen.join(' -> ')}`,
    ).toBe(seen.length)
  })

  test('brass is never used as a text colour (Section 6)', async ({ page }) => {
    await page.goto('/')
    const offenders = await page.evaluate(() => {
      const brass = 'rgb(168, 132, 63)'
      const bad: string[] = []
      for (const element of document.querySelectorAll<HTMLElement>('body *')) {
        const hasText = [...element.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        )
        if (hasText && getComputedStyle(element).color === brass) {
          bad.push(element.tagName + (element.className ? `.${element.className}` : ''))
        }
      }
      return bad
    })
    expect(offenders, offenders.join(', ')).toEqual([])
  })
})
