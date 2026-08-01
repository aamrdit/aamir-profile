import { beforeEach, describe, expect, it, vi } from 'vitest'
import { processEnquiry, type EnquiryDeps } from '~/server/utils/enquiry'

/** Obviously fictional fixture data, per Section 17.2. */
const validBody = {
  name: 'Jordan Fictional',
  email: 'jordan@example.com',
  company: 'Example Holdings',
  message: 'We have a supplier onboarding process that takes far too long.',
  timeline: 'month',
  consent: true,
  website: '',
  turnstileToken: 'test-token',
}

let deps: EnquiryDeps

function makeDeps(overrides: Partial<EnquiryDeps> = {}): EnquiryDeps {
  return {
    verifyTurnstile: vi.fn(async () => true),
    sendMail: vi.fn(async () => {}),
    turnstileConfigured: true,
    mailConfigured: true,
    log: vi.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  deps = makeDeps()
})

describe('processEnquiry', () => {
  it('accepts a valid payload and sends exactly one mail', async () => {
    const result = await processEnquiry(validBody, deps)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ ok: true })
    expect(deps.sendMail).toHaveBeenCalledTimes(1)
  })

  it('includes the enquiry details in the mail body', async () => {
    await processEnquiry(validBody, deps)
    const call = vi.mocked(deps.sendMail).mock.calls[0]![0]

    expect(call.subject).toContain('Jordan Fictional')
    expect(call.text).toContain('jordan@example.com')
    expect(call.text).toContain('month')
    expect(call.text).toContain('supplier onboarding')
  })

  it('rejects an invalid payload with 400 and sends nothing', async () => {
    const result = await processEnquiry({ ...validBody, email: 'nope' }, deps)

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
    expect((result.body as { errors: Record<string, string> }).errors.email).toBeTruthy()
  })

  it('rejects an empty payload with 400 and sends nothing', async () => {
    const result = await processEnquiry({}, deps)

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('rejects a missing consent with 400', async () => {
    const result = await processEnquiry({ ...validBody, consent: false }, deps)

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('rejects an oversize message with 400', async () => {
    const result = await processEnquiry(
      { ...validBody, message: 'a'.repeat(2001) },
      deps,
    )

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('returns 400 when the Turnstile token is missing', async () => {
    deps = makeDeps({ verifyTurnstile: vi.fn(async (token) => !!token) })
    const result = await processEnquiry(
      { ...validBody, turnstileToken: undefined },
      deps,
    )

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('returns 400 when the Turnstile token is rejected', async () => {
    deps = makeDeps({ verifyTurnstile: vi.fn(async () => false) })
    const result = await processEnquiry(validBody, deps)

    expect(result.status).toBe(400)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('skips Turnstile entirely when it is not configured', async () => {
    deps = makeDeps({ turnstileConfigured: false })
    const result = await processEnquiry(
      { ...validBody, turnstileToken: undefined },
      deps,
    )

    expect(result.status).toBe(200)
    expect(deps.verifyTurnstile).not.toHaveBeenCalled()
    expect(deps.sendMail).toHaveBeenCalledTimes(1)
  })

  it('discards a filled honeypot silently with 200 and sends nothing', async () => {
    const result = await processEnquiry(
      { ...validBody, website: 'http://spam.example' },
      deps,
    )

    // A bot must not be able to tell this apart from success.
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ ok: true })
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('returns 500 with a generic message when the provider throws', async () => {
    deps = makeDeps({
      sendMail: vi.fn(async () => {
        throw new Error('smtp exploded at line 42')
      }),
    })
    const result = await processEnquiry(validBody, deps)

    expect(result.status).toBe(500)
    const serialised = JSON.stringify(result.body)
    expect(serialised).not.toContain('smtp exploded')
    expect(serialised).not.toContain('at line')
    expect(serialised.toLowerCase()).not.toContain('stack')
  })

  it('returns 500 rather than silently dropping when mail is unconfigured', async () => {
    deps = makeDeps({ mailConfigured: false })
    const result = await processEnquiry(validBody, deps)

    expect(result.status).toBe(500)
    expect(deps.sendMail).not.toHaveBeenCalled()
  })

  it('never logs an IP address or user agent (FR-911, Section 17.3)', async () => {
    deps = makeDeps({
      sendMail: vi.fn(async () => {
        throw new Error('provider down')
      }),
    })

    await processEnquiry(
      { ...validBody, ip: '203.0.113.7', userAgent: 'Mozilla/5.0 (fictional)' },
      deps,
    )

    for (const call of vi.mocked(deps.log).mock.calls) {
      const line = String(call[0])
      expect(line).not.toContain('203.0.113.7')
      expect(line.toLowerCase()).not.toContain('mozilla')
      expect(line.toLowerCase()).not.toContain('user-agent')
    }
  })
})
