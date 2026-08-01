import { expect, test } from '@playwright/test'

/** The eleven <section> elements, in DOM order. See DECISIONS.md C1. */
const SECTION_IDS = [
  'hero',
  'proof',
  'collapse',
  'services',
  'engage',
  'work',
  'toolkit',
  'about',
  'availability',
  'faq',
  'contact',
]

test.describe('scroll and visibility', () => {
  test('every section becomes visible in DOM order while scrolling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    for (const id of SECTION_IDS) {
      const section = page.locator(`#${id}`)
      await section.scrollIntoViewIfNeeded()
      await expect(section, `#${id} never became visible`).toBeVisible()
    }
  })

  test('nine steps before, three cards and six residue rules after (FR-403, FR-404)', async ({
    page,
  }) => {
    await page.goto('/')

    // Both states are always in the DOM; which one shows is CSS. Counts are
    // what the spec asserts, and they hold throughout.
    await expect(page.getByTestId('collapse-step')).toHaveCount(9)

    // Before the section is reached, the nine step state is the visible one.
    await expect(page.getByTestId('collapse-step').first()).toBeVisible()
    await expect(page.getByTestId('collapse-card').first()).toBeHidden()

    await page.locator('#collapse').scrollIntoViewIfNeeded()

    await expect(page.getByTestId('collapse-card')).toHaveCount(3)
    await expect(page.getByTestId('collapse-residue')).toHaveCount(6)
    await expect(page.getByTestId('collapse-card').first()).toBeVisible()
    await expect(page.getByTestId('collapse-step').first()).toBeHidden()
  })

  test('fires once and does not re-trigger on the way back up (FR-407)', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#collapse').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('collapse-card').first()).toBeVisible()

    await page.locator('#hero').scrollIntoViewIfNeeded()
    await page.locator('#collapse').scrollIntoViewIfNeeded()

    // Still collapsed: the observer disconnected after the first hit.
    await expect(page.getByTestId('collapse-card').first()).toBeVisible()
    await expect(page.getByTestId('collapse-step').first()).toBeHidden()
  })

  test('reduced motion renders the end state immediately with no transition (FR-408)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Visible before the section is ever scrolled to.
    await expect(page.getByTestId('collapse-card')).toHaveCount(3)
    await expect(page.getByTestId('collapse-card').first()).toBeVisible()
    await expect(page.getByTestId('collapse-caption')).toBeVisible()

    // getComputedStyle normalises to seconds, so the reduced-motion override of
    // 0.01ms reads as "0.00001s". Parse it rather than string-matching.
    const duration = await page
      .getByTestId('collapse-card')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration)
    const seconds = Math.max(...duration.split(',').map((d) => Number.parseFloat(d)))
    expect(seconds, `transition still runs for ${duration}`).toBeLessThan(0.05)
  })

  test('with JavaScript disabled the end state renders and all sections have text', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')

    await expect(page.getByTestId('collapse-card')).toHaveCount(3)
    await expect(page.getByTestId('collapse-card').first()).toBeVisible()
    await expect(page.getByTestId('collapse-caption')).toBeVisible()

    for (const id of SECTION_IDS) {
      const text = await page.locator(`#${id}`).innerText()
      expect(text.trim().length, `#${id} is empty without JavaScript`).toBeGreaterThan(0)
    }

    await context.close()
  })

  test('section_viewed fires exactly once per section (Section 13)', async ({ page }) => {
    // useAnalytics routes through window.__track when present, which is the
    // stub seam Section 13 requires.
    await page.addInitScript(() => {
      const w = window as unknown as {
        __track: (name: string, props: Record<string, unknown>) => void
        __events: Array<{ name: string; props: Record<string, unknown> }>
      }
      w.__events = []
      w.__track = (name, props) => w.__events.push({ name, props })
    })

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    for (const id of SECTION_IDS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    }
    // Back up again: a second pass must not re-fire anything.
    for (const id of [...SECTION_IDS].reverse()) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    }

    const counts = await page.evaluate(() => {
      const events = (window as unknown as {
        __events: Array<{ name: string; props: Record<string, unknown> }>
      }).__events
      const out: Record<string, number> = {}
      for (const event of events) {
        if (event.name !== 'section_viewed') continue
        const id = String(event.props.section_id)
        out[id] = (out[id] ?? 0) + 1
      }
      return out
    })

    for (const id of SECTION_IDS) {
      expect(counts[id], `#${id} fired ${counts[id] ?? 0} times`).toBe(1)
    }
  })

  test('no scroll event listener reaches the built output (FR-406)', async ({ page }) => {
    await page.goto('/')
    const added: string[] = []
    await page.exposeFunction('__recordScrollListener', (stack: string) => {
      added.push(stack)
    })
    await page.evaluate(() => {
      const original = EventTarget.prototype.addEventListener
      EventTarget.prototype.addEventListener = function (type, ...rest) {
        if (type === 'scroll') {
          // @ts-expect-error injected for the test only
          window.__recordScrollListener(new Error().stack ?? 'unknown')
        }
        return original.call(this, type, ...rest)
      }
    })
    await page.locator('#collapse').scrollIntoViewIfNeeded()
    await page.locator('#contact').scrollIntoViewIfNeeded()

    expect(added, added.join('\n')).toEqual([])
  })
})
