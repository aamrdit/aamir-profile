import { expect, test } from '@playwright/test'

test.describe('media', () => {
  test('every image has an alt, explicit dimensions, and actually loads', async ({
    page,
  }) => {
    await page.goto('/')

    // Below-fold images are lazy by design, so bring each into view and let it
    // settle before asking whether it loaded. Checking naturalWidth without
    // this only proves the hero loaded.
    const all = page.locator('img')
    for (let i = 0; i < (await all.count()); i += 1) {
      await all.nth(i).scrollIntoViewIfNeeded()
    }
    await page.waitForFunction(() =>
      [...document.querySelectorAll('img')].every((img) => img.complete),
    )

    const images = await page.locator('img').evaluateAll((nodes) =>
      nodes.map((node) => {
        const img = node as HTMLImageElement
        return {
          src: img.getAttribute('src') ?? '',
          alt: img.getAttribute('alt'),
          ariaHidden: img.getAttribute('aria-hidden'),
          width: img.getAttribute('width'),
          height: img.getAttribute('height'),
          naturalWidth: img.naturalWidth,
        }
      }),
    )

    expect(images.length).toBeGreaterThan(0)

    for (const img of images) {
      // Empty alt is permitted only alongside aria-hidden="true".
      expect(img.alt, `${img.src} has a null alt`).not.toBeNull()
      if (img.alt === '') expect(img.ariaHidden, `${img.src}`).toBe('true')

      // Explicit dimensions reserve the box and keep CLS at zero.
      expect(img.width, `${img.src} has no width attribute`).toBeTruthy()
      expect(img.height, `${img.src} has no height attribute`).toBeTruthy()

      expect(img.naturalWidth, `${img.src} did not load`).toBeGreaterThan(0)
    }
  })

  test('hero image is eager with high fetch priority (FR-209)', async ({ page }) => {
    await page.goto('/')
    const hero = page.getByTestId('hero-image')
    await expect(hero).toHaveAttribute('fetchpriority', 'high')
    await expect(hero).toHaveAttribute('loading', 'eager')
  })

  test('below-fold images are lazy', async ({ page }) => {
    await page.goto('/')
    const offenders = await page.locator('img').evaluateAll((nodes) =>
      nodes
        .filter((node) => node.getAttribute('data-testid') !== 'hero-image')
        .filter((node) => node.getAttribute('loading') !== 'lazy')
        .map((node) => node.getAttribute('src') ?? '(no src)'),
    )
    expect(offenders, `not lazy: ${offenders.join(', ')}`).toEqual([])
  })

  test('images are served as WebP or AVIF', async ({ page, request }) => {
    await page.goto('/')
    const sources = await page
      .locator('img')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src') ?? ''))

    for (const src of sources.filter(Boolean)) {
      const response = await request.get(src)
      const type = response.headers()['content-type'] ?? ''
      expect(type, `${src} served as ${type}`).toMatch(/image\/(webp|avif)/)
    }
  })

  test('the reserved video slot is 16:9 and holds no video in v1 (FR-602)', async ({
    page,
  }) => {
    await page.goto('/')
    const slot = page.getByTestId('video-slot')
    await expect(slot).toBeVisible()

    const ratio = await slot.evaluate((el) => getComputedStyle(el).aspectRatio)
    expect(ratio.replace(/\s/g, '')).toBe('16/9')

    await expect(slot.locator('video')).toHaveCount(0)
  })
})
