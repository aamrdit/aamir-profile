import { expect, test } from '@playwright/test'

/** The slug uses a single 'a'. That is correct and must not be "fixed". */
const LINKEDIN = 'https://www.linkedin.com/in/amir-butt-741a9937/'

test.describe('social links', () => {
  test('LinkedIn href matches exactly, single-a slug included', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('link-linkedin')).toHaveAttribute('href', LINKEDIN)
  })

  test('X href resolves to the @aamirbutt profile', async ({ page }) => {
    await page.goto('/')
    const href = await page.getByTestId('link-x').getAttribute('href')
    expect(href).toBeTruthy()
    expect(new URL(href!).pathname.replace(/^\//, '')).toBe('aamirbutt')
  })

  test('both open in a new tab with a safe rel (FR-913)', async ({ page }) => {
    await page.goto('/')

    for (const testid of ['link-linkedin', 'link-x']) {
      const link = page.getByTestId(testid)
      await expect(link).toHaveAttribute('target', '_blank')

      const rel = (await link.getAttribute('rel')) ?? ''
      expect(rel, `${testid} rel is "${rel}"`).toContain('noopener')
      expect(rel, `${testid} rel is "${rel}"`).toContain('noreferrer')
    }
  })

  test('both have a meaningful accessible name', async ({ page }) => {
    await page.goto('/')

    for (const testid of ['link-linkedin', 'link-x']) {
      const name = (await page.getByTestId(testid).innerText()).trim()
      expect(name.length).toBeGreaterThan(0)
      expect(name.toLowerCase()).not.toBe('link')
      expect(name.toLowerCase()).not.toBe('here')
    }
  })

  test('no "click here" or "read more" anywhere on the page (SEO-11)', async ({
    page,
  }) => {
    await page.goto('/')
    const offenders = await page.locator('a').evaluateAll((links) =>
      links
        .map((link) => (link.textContent ?? '').trim().toLowerCase())
        .filter((text) => text === 'click here' || text === 'read more'),
    )
    expect(offenders).toEqual([])
  })
})
