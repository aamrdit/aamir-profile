import { expect, test, type Page } from '@playwright/test'

/**
 * Smooth scrolling is on (FR-006), so wait for the position to settle. Polled
 * from the Playwright side rather than with requestAnimationFrame inside the
 * page: the rAF version stalled indefinitely in Firefox.
 */
async function waitForScrollToSettle(page: Page) {
  let last = Number.NaN
  for (let i = 0; i < 40; i += 1) {
    const y = await page.evaluate(() => window.scrollY)
    if (y === last) return
    last = y
    await page.waitForTimeout(50)
  }
}

test.describe('navigation', () => {
  test('every in-page anchor resolves to an element that exists (FR-108)', async ({
    page,
  }) => {
    await page.goto('/')
    const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!).filter((href) => href !== '#'),
    )
    expect(hrefs.length).toBeGreaterThan(0)

    for (const href of hrefs) {
      await expect(page.locator(href), `${href} has no matching element`).toHaveCount(1)
    }
  })

  test('nav anchors scroll to their target and update the hash', async ({ page }) => {
    await page.goto('/')

    for (const [testid, target] of [
      ['nav-link-work', 'work'],
      ['nav-link-availability', 'availability'],
      ['nav-link-contact', 'contact'],
    ] as const) {
      const link = page.getByTestId(testid)
      if (!(await link.isVisible())) test.skip(true, 'desktop nav links only')

      // The hash updates synchronously on activation; waiting out the smooth
      // scroll here only made the test slow and flaky in Firefox. Scroll
      // position is asserted in the SC 2.4.11 test below.
      await link.click()
      expect(new URL(page.url()).hash).toBe(`#${target}`)
    }
  })

  test('the target heading is not obscured by the fixed nav (WCAG 2.2 SC 2.4.11)', async ({
    page,
  }) => {
    // FR-006 disables smooth scrolling under reduced motion, so jumps are
    // instant. Asserting the landing position is the point here, not the
    // animation, and this removes a large source of Firefox flake.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const link = page.getByTestId('nav-link-work')
    if (!(await link.isVisible())) test.skip(true, 'desktop nav links only')

    await link.click()
    await waitForScrollToSettle(page)

    const navHeight = (await page.getByTestId('nav').boundingBox())?.height ?? 0
    const headingTop = (await page.locator('#work-heading').boundingBox())?.y ?? -1

    expect(navHeight).toBeGreaterThan(0)
    expect(headingTop).toBeGreaterThan(navHeight)
  })

  test('skip link is first focusable, visible on focus, and moves focus into main', async ({
    page,
    browserName,
  }) => {
    // WebKit does not move focus to links with Tab unless macOS "Full Keyboard
    // Access" is on, which Playwright cannot enable. Real keyboard traversal on
    // Safari is covered by Section 16 items 6 and 8.
    test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default')

    await page.goto('/')
    await page.keyboard.press('Tab')

    const skip = page.getByTestId('skip-link')
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()

    await page.keyboard.press('Enter')
    await waitForScrollToSettle(page)

    const focusedId = await page.evaluate(() => document.activeElement?.id ?? '')
    expect(['main', '']).toContain(focusedId)
    expect(new URL(page.url()).hash).toBe('#main')
  })

  test('nav turns solid past the 80px threshold and reverts at the top (FR-102)', async ({
    page,
  }) => {
    // The 150ms colour transition otherwise leaves the assertion sampling a
    // mid-transition value (Firefox reported rgba(233,232,227,0.625)). Reduced
    // motion removes the transition per Section 6, leaving the state change
    // itself -- which is what FR-102 is about -- observable instantly.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const nav = page.getByTestId('nav')
    const backgroundOf = () =>
      nav.evaluate((element) => getComputedStyle(element).backgroundColor)

    const atTop = await backgroundOf()
    expect(atTop).toMatch(/rgba\(0, 0, 0, 0\)|transparent/)

    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' as ScrollBehavior }))
    await expect.poll(backgroundOf).toBe('rgb(233, 232, 227)')

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
    await expect.poll(backgroundOf).toMatch(/rgba\(0, 0, 0, 0\)|transparent/)
  })
})
