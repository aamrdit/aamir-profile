import { expect, test } from '@playwright/test'

const TITLE = 'Aamir Butt | Automation & Enterprise Architecture Contractor, UK'
const ORIGIN = 'https://aamirbutt.com'

/** FR-001. Thirteen IDs, eleven of which are sections -- see DECISIONS.md C1. */
const BLOCK_IDS = [
  'nav',
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
  'footer',
]

test.describe('page load', () => {
  test('/ returns 200', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('title matches SEO-01 exactly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(TITLE)

    // SEO-01 specifies this string verbatim AND annotates it "(under 60
    // characters)". The string it specifies is 64. The verbatim requirement
    // wins; the parenthetical is wrong about its own value. Pinned here so a
    // future edit cannot lengthen it further. See DECISIONS.md.
    expect(TITLE).toHaveLength(64)
  })

  test('exactly one non-empty h1', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    expect((await h1.innerText()).trim().length).toBeGreaterThan(0)
  })

  test('meta description is present and 120 to 160 characters', async ({ page }) => {
    await page.goto('/')
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThanOrEqual(120)
    expect(description!.length).toBeLessThanOrEqual(160)
  })

  test('canonical points at the production origin', async ({ page }) => {
    await page.goto('/')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical!.startsWith(ORIGIN)).toBe(true)
  })

  test('all thirteen FR-001 IDs exist in the DOM', async ({ page }) => {
    await page.goto('/')
    for (const id of BLOCK_IDS) {
      await expect(page.locator(`#${id}`), `#${id} is missing`).toHaveCount(1)
    }
  })

  test('no console errors and no failed requests on load', async ({ page }) => {
    const consoleErrors: string[] = []
    const failed: string[] = []

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('requestfailed', (request) => {
      failed.push(`${request.url()} ${request.failure()?.errorText ?? ''}`)
    })
    page.on('response', (response) => {
      if (response.status() >= 400) failed.push(`${response.url()} ${response.status()}`)
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0)
    expect(failed, failed.join('\n')).toHaveLength(0)
  })

  for (const path of ['/legal', '/thanks', '/robots.txt', '/sitemap.xml']) {
    test(`${path} returns 200`, async ({ request }) => {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
    })
  }

  test('/llms.txt and /aamir-butt.md return 200', async ({ request }) => {
    for (const path of ['/llms.txt', '/aamir-butt.md']) {
      expect((await request.get(path)).status()).toBe(200)
    }
  })

  test('all four JSON-LD blocks parse and carry the expected @type', async ({
    page,
  }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = blocks.flatMap((block) => {
      const parsed: unknown = JSON.parse(block)
      return Array.isArray(parsed)
        ? parsed.map((entry) => (entry as { '@type': string })['@type'])
        : [(parsed as { '@type': string })['@type']]
    })
    for (const expected of ['Person', 'ProfilePage', 'Service', 'FAQPage']) {
      expect(types).toContain(expected)
    }
  })

  test('hero image reports non-zero naturalWidth', async ({ page }) => {
    await page.goto('/')
    const width = await page
      .getByTestId('hero-image')
      .evaluate((img) => (img as HTMLImageElement).naturalWidth)
    expect(width).toBeGreaterThan(0)
  })
})
