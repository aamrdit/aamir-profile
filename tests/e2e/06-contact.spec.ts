import { expect, test, type Page } from '@playwright/test'

const MAILTO = 'mailto:aamir.butt@outlook.com?subject=Contract%20enquiry%20via%20website'

/** Obviously fictional, per Section 17.2. */
const FIXTURE = {
  name: 'Jordan Fictional',
  email: 'jordan@example.com',
  company: 'Example Holdings',
  message: 'We have a supplier onboarding process that takes far too long to run.',
  timeline: 'month',
}

async function fillValidly(page: Page) {
  await page.getByTestId('field-name').fill(FIXTURE.name)
  await page.getByTestId('field-email').fill(FIXTURE.email)
  await page.getByTestId('field-company').fill(FIXTURE.company)
  await page.getByTestId('field-message').fill(FIXTURE.message)
  await page.getByTestId('field-timeline').selectOption(FIXTURE.timeline)
  await page.getByTestId('field-consent').check()
}

test.describe('contact', () => {
  test('the mailto link matches FR-903 exactly, subject encoding included', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('mailto-link')).toHaveAttribute('href', MAILTO)
  })

  test('an empty submit shows errors and fires zero network requests', async ({
    page,
  }) => {
    await page.goto('/')

    let requests = 0
    await page.route('**/api/enquiry', async (route) => {
      requests += 1
      await route.fulfill({ status: 200, json: { ok: true } })
    })

    await page.getByTestId('submit-enquiry').click()

    for (const field of ['name', 'email', 'message', 'timeline', 'consent']) {
      await expect(page.getByTestId(`error-${field}`), `${field} error missing`).toBeVisible()
    }
    expect(requests).toBe(0)
  })

  test('each error is associated to its field via aria-describedby', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('submit-enquiry').click()

    for (const field of ['name', 'email', 'message', 'timeline', 'consent']) {
      const describedBy = await page.getByTestId(`field-${field}`).getAttribute('aria-describedby')
      expect(describedBy, `${field} is not described by its error`).toContain(`error-${field}`)
    }
  })

  test('the error summary receives focus on a failed submit', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('submit-enquiry').click()

    const summary = page.getByTestId('error-summary')
    await expect(summary).toBeVisible()
    await expect(summary).toBeFocused()
  })

  test('a malformed email is rejected on the client', async ({ page }) => {
    await page.goto('/')

    let requests = 0
    await page.route('**/api/enquiry', async (route) => {
      requests += 1
      await route.fulfill({ status: 200, json: { ok: true } })
    })

    await fillValidly(page)
    await page.getByTestId('field-email').fill('jordan-at-example')
    await page.getByTestId('submit-enquiry').click()

    await expect(page.getByTestId('error-email')).toBeVisible()
    expect(requests).toBe(0)
  })

  test('submit is blocked when consent is unchecked', async ({ page }) => {
    await page.goto('/')

    let requests = 0
    await page.route('**/api/enquiry', async (route) => {
      requests += 1
      await route.fulfill({ status: 200, json: { ok: true } })
    })

    await fillValidly(page)
    await page.getByTestId('field-consent').uncheck()
    await page.getByTestId('submit-enquiry').click()

    await expect(page.getByTestId('error-consent')).toBeVisible()
    expect(requests).toBe(0)
  })

  test('the honeypot is present, hidden and empty by default', async ({ page }) => {
    await page.goto('/')
    const honeypot = page.getByTestId('field-honeypot')

    await expect(honeypot).toHaveCount(1)
    await expect(honeypot).toHaveValue('')
    await expect(honeypot).toHaveAttribute('tabindex', '-1')

    // It is clipped to a 1px box rather than display:none, because some bots
    // skip fields that are outright hidden. Playwright still reports a clipped
    // element as "visible", so assert it is imperceptible and out of the
    // accessibility tree instead.
    const wrapper = await honeypot.evaluate((el) => {
      const container = el.closest('[aria-hidden="true"]')
      if (!container) return null
      const rect = container.getBoundingClientRect()
      return {
        width: rect.width,
        height: rect.height,
        clipped: getComputedStyle(container).clipPath !== 'none',
      }
    })

    expect(wrapper, 'honeypot is not inside an aria-hidden container').not.toBeNull()
    expect(wrapper!.width).toBeLessThanOrEqual(1)
    expect(wrapper!.height).toBeLessThanOrEqual(1)
    expect(wrapper!.clipped).toBe(true)
  })

  test('the consent control meets the 44px touch target (FR-008)', async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, 'FR-008 sets 44px on touch viewports')
    await page.goto('/')

    // The checkbox itself draws at 24px and cannot grow -- Chrome ignores
    // padding on a native checkbox. The label wraps it, so the row is the
    // target, which is what a person actually taps.
    const row = await page.locator('label[for="field-consent"]').boundingBox()
    expect(row, 'consent label not found').not.toBeNull()
    expect(row!.height, `consent row is ${Math.round(row!.height)}px tall`).toBeGreaterThanOrEqual(44)

    // Tapping the row toggles it.
    await page.locator('label[for="field-consent"]').click({ position: { x: 12, y: 12 } })
    await expect(page.getByTestId('field-consent')).toBeChecked()
  })

  test('the privacy link navigates without toggling consent', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('field-consent').setChecked(false)

    // A link nested inside a label otherwise toggles the control on the way.
    await page.getByTestId('enquiry-form').getByRole('link', { name: 'Privacy notice' }).click()
    await page.waitForURL('**/legal')

    await page.goBack()
    await expect(page.getByTestId('field-consent')).not.toBeChecked()
  })

  test('a valid submit navigates to /thanks', async ({ page }) => {
    await page.goto('/')
    await page.route('**/api/enquiry', async (route) => {
      await route.fulfill({ status: 200, json: { ok: true } })
    })

    await fillValidly(page)
    await page.getByTestId('submit-enquiry').click()

    await page.waitForURL('**/thanks')
    await expect(page.locator('h1')).toHaveText('Enquiry received.')
  })

  test('a 500 shows the banner, stays on the page and keeps the input', async ({
    page,
  }) => {
    await page.goto('/')
    await page.route('**/api/enquiry', async (route) => {
      await route.fulfill({ status: 500, json: { ok: false } })
    })

    await fillValidly(page)
    await page.getByTestId('submit-enquiry').click()

    await expect(page.getByTestId('form-error-banner')).toBeVisible()
    expect(new URL(page.url()).pathname).toBe('/')

    // FR-909: nothing the user typed is thrown away.
    await expect(page.getByTestId('field-name')).toHaveValue(FIXTURE.name)
    await expect(page.getByTestId('field-email')).toHaveValue(FIXTURE.email)
    await expect(page.getByTestId('field-message')).toHaveValue(FIXTURE.message)
  })

  test('two rapid presses fire exactly one request (FR-908)', async ({ page }) => {
    await page.goto('/')

    let requests = 0
    await page.route('**/api/enquiry', async (route) => {
      requests += 1
      // Held open long enough that a second press would land mid-flight.
      await new Promise((resolve) => setTimeout(resolve, 600))
      await route.fulfill({ status: 500, json: { ok: false } })
    })

    await fillValidly(page)
    const submit = page.getByTestId('submit-enquiry')
    await submit.click()
    await submit.click({ force: true })

    await expect(page.getByTestId('form-error-banner')).toBeVisible()
    expect(requests).toBe(1)
  })

  test('the submit button reports busy while sending (FR-906)', async ({ page }) => {
    await page.goto('/')
    await page.route('**/api/enquiry', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.fulfill({ status: 500, json: { ok: false } })
    })

    await fillValidly(page)
    const submit = page.getByTestId('submit-enquiry')
    await submit.click()

    await expect(submit).toHaveAttribute('aria-busy', 'true')
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveText('Sending')
  })
})
