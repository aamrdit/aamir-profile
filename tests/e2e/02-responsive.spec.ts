import { expect, test } from '@playwright/test'

const WIDTHS = [320, 375, 390, 768, 1024, 1440, 1920]

function columnCount(template: string) {
  return template.split(' ').filter(Boolean).length
}

test.describe('responsive', () => {
  /**
   * Section 14 calls this the single highest value test in the suite, so it
   * runs every width against every route rather than just the home page.
   */
  test('no horizontal overflow at any width', async ({ page }) => {
    for (const path of ['/', '/legal', '/thanks']) {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        await page.waitForLoadState('networkidle')

        const scrollWidth = await page.evaluate(
          () => document.documentElement.scrollWidth,
        )
        expect(scrollWidth, `${path} overflows at ${width}px`).toBeLessThanOrEqual(width)
      }
    }
  })

  test('no computed font size below 12px at any width', async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const tooSmall = await page.evaluate(() => {
        const bad: string[] = []
        for (const el of document.querySelectorAll<HTMLElement>('body *')) {
          const hasText = [...el.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
          )
          if (!hasText) continue
          const size = Number.parseFloat(getComputedStyle(el).fontSize)
          if (size < 12) bad.push(`${el.tagName} ${size}px "${el.textContent?.trim().slice(0, 20)}"`)
        }
        return bad
      })

      expect(tooSmall, `at ${width}px: ${tooSmall.join('; ')}`).toEqual([])
    }
  })

  test('mobile nav at 375px: trigger visible, overlay traps focus and closes on Escape', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default')

    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const trigger = page.getByTestId('nav-menu-trigger')
    await expect(trigger).toBeVisible()

    await trigger.click()
    const overlay = page.getByTestId('nav-menu-overlay')
    await expect(overlay).toBeVisible()

    // Contains every nav anchor.
    for (const label of ['Work', 'Availability', 'Contact']) {
      await expect(overlay.getByRole('link', { name: label })).toBeVisible()
    }

    // Focus stays inside while open.
    const inside = await page.evaluate(() => {
      const overlayEl = document.querySelector('[data-testid="nav-menu-overlay"]')
      return !!overlayEl?.contains(document.activeElement)
    })
    expect(inside).toBe(true)

    await page.keyboard.press('Escape')
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('desktop nav at 1440px: links visible, no menu trigger', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    for (const testid of ['nav-link-work', 'nav-link-availability', 'nav-link-contact']) {
      await expect(page.getByTestId(testid)).toBeVisible()
    }
    await expect(page.getByTestId('nav-menu-trigger')).toBeHidden()
  })

  test('proof strip is 4 cells, 2 columns at 375px and 4 at 1440px (FR-304)', async ({
    page,
  }) => {
    for (const [width, expected] of [
      [375, 2],
      [1440, 4],
    ] as const) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      await expect(page.getByTestId('proof-cell')).toHaveCount(4)

      const template = await page
        .getByTestId('proof-cell')
        .first()
        .evaluate((cell) => getComputedStyle(cell.parentElement!).gridTemplateColumns)
      expect(columnCount(template), `at ${width}px`).toBe(expected)
    }
  })

  test('page is usable at 200% zoom at 1280px', async ({ page }) => {
    // 200% zoom is equivalent to halving the CSS viewport (WCAG 1.4.10).
    await page.setViewportSize({ width: 640, height: 512 })
    await page.goto('/')

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(640)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('service cards are 1 column at 375px and 3 at 1440px (FR-501)', async ({
    page,
  }) => {
    for (const [width, expected] of [
      [375, 1],
      [1440, 3],
    ] as const) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      await expect(page.getByTestId('service-card')).toHaveCount(3)

      const template = await page
        .getByTestId('service-card')
        .first()
        .evaluate((card) => getComputedStyle(card.parentElement!).gridTemplateColumns)
      expect(columnCount(template), `at ${width}px`).toBe(expected)
    }
  })

  /**
   * Section 14 defers visual snapshots until the design settles, so these
   * baselines are committed at M8.
   *
   * Restricted to chromium-desktop: baselines are per-project, and on this
   * machine headless Firefox falls back to the SWGL software compositor, which
   * makes its output too unstable to be a useful regression signal. Cross
   * browser rendering is covered by the layout assertions above and by Section
   * 16's manual checks. See DECISIONS.md.
   */
  test('full page screenshots match at 375, 768 and 1440px', async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-desktop',
      'visual baselines are kept for one project only',
    )
    // Baselines are platform-suffixed and were generated on Windows. CI runs
    // on Linux and would need its own set, regenerated inside the Playwright
    // container. Until that exists, CI relies on the layout assertions above.
    test.skip(!!process.env.CI, 'no Linux baselines committed yet')
    expect(browserName).toBe('chromium')

    // Reduced motion pins the collapse section to its end state and removes the
    // hero stagger, so the capture is deterministic.
    await page.emulateMedia({ reducedMotion: 'reduce' })

    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot(`home-${width}.png`, {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
      })
    }
  })
})
