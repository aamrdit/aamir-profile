import { describe, expect, it } from 'vitest'
import { TIMELINE_VALUES, enquirySchema, fieldErrors } from '~/schemas/enquiry'

/**
 * Section 14 names the boundaries this must cover: 1/2/80/81 on name,
 * 19/20/2000/2001 on message, every valid timeline plus one invalid, and
 * consent both false and true.
 *
 * Fixture data is obviously fictional per Section 17.2.
 */
const valid = {
  name: 'Jordan Fictional',
  email: 'jordan@example.com',
  company: 'Example Holdings',
  message: 'We have a supplier onboarding process that takes far too long.',
  timeline: 'month' as const,
  consent: true as const,
  website: '' as const,
}

function parse(overrides: Record<string, unknown> = {}) {
  return enquirySchema.safeParse({ ...valid, ...overrides })
}

describe('enquirySchema', () => {
  it('accepts a well formed enquiry', () => {
    expect(parse().success).toBe(true)
  })

  describe('name', () => {
    it.each([
      [1, false],
      [2, true],
      [80, true],
      [81, false],
    ])('length %i is accepted: %s', (length, expected) => {
      expect(parse({ name: 'a'.repeat(length) }).success).toBe(expected)
    })

    it('rejects an empty name', () => {
      expect(parse({ name: '' }).success).toBe(false)
    })
  })

  describe('message', () => {
    it.each([
      [19, false],
      [20, true],
      [2000, true],
      [2001, false],
    ])('length %i is accepted: %s', (length, expected) => {
      expect(parse({ message: 'a'.repeat(length) }).success).toBe(expected)
    })
  })

  describe('email', () => {
    it.each(['jordan@example.com', 'a.b+c@sub.example.co.uk'])('accepts %s', (email) => {
      expect(parse({ email }).success).toBe(true)
    })

    it.each(['jordan', 'jordan@', '@example.com', 'jordan example.com', ''])(
      'rejects %s',
      (email) => {
        expect(parse({ email }).success).toBe(false)
      },
    )
  })

  describe('company', () => {
    it('is optional', () => {
      expect(parse({ company: undefined }).success).toBe(true)
      expect(parse({ company: '' }).success).toBe(true)
    })

    it.each([
      [120, true],
      [121, false],
    ])('length %i is accepted: %s', (length, expected) => {
      expect(parse({ company: 'a'.repeat(length) }).success).toBe(expected)
    })
  })

  describe('timeline', () => {
    it.each(TIMELINE_VALUES)('accepts %s', (timeline) => {
      expect(parse({ timeline }).success).toBe(true)
    })

    it('rejects a value outside the set', () => {
      expect(parse({ timeline: 'someday' }).success).toBe(false)
    })

    it('rejects a missing timeline', () => {
      expect(parse({ timeline: undefined }).success).toBe(false)
    })
  })

  describe('consent', () => {
    it('accepts true', () => {
      expect(parse({ consent: true }).success).toBe(true)
    })

    it.each([false, undefined, 'true'])('rejects %s', (consent) => {
      expect(parse({ consent }).success).toBe(false)
    })
  })

  describe('honeypot', () => {
    it('accepts an empty value', () => {
      expect(parse({ website: '' }).success).toBe(true)
      expect(parse({ website: undefined }).success).toBe(true)
    })

    it('rejects a filled value', () => {
      expect(parse({ website: 'http://spam.example' }).success).toBe(false)
    })
  })
})

describe('fieldErrors', () => {
  it('returns one message per field, keyed by field name', () => {
    const result = parse({ name: 'a', message: 'too short', consent: false })
    expect(result.success).toBe(false)
    if (result.success) return

    const errors = fieldErrors(result.error)
    expect(Object.keys(errors).sort()).toEqual(['consent', 'message', 'name'])
    for (const message of Object.values(errors)) {
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('keeps only the first message when a field has several issues', () => {
    // A 300-character non-address fails both the email rule and the length
    // rule, producing two issues on one field. The form shows one message per
    // field, so the first must win.
    const result = parse({ email: 'a'.repeat(300) })
    if (result.success) throw new Error('expected failure')

    expect(result.error.issues.filter((i) => i.path[0] === 'email').length).toBeGreaterThan(1)

    const errors = fieldErrors(result.error)
    expect(Object.keys(errors)).toEqual(['email'])
    expect(typeof errors.email).toBe('string')
  })

  it('never apologises and never says "invalid input" (FR-907)', () => {
    const result = parse({ name: '', email: 'nope', message: '', timeline: 'x', consent: false })
    if (result.success) throw new Error('expected failure')

    for (const message of Object.values(fieldErrors(result.error))) {
      expect(message.toLowerCase()).not.toContain('sorry')
      expect(message.toLowerCase()).not.toContain('invalid input')
    }
  })
})
