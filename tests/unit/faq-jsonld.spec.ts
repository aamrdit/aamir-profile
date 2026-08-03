import { describe, expect, it } from 'vitest'
import { FAQ, jsonLdBlocks } from '~/content/site'

/**
 * FR-805: the FAQ answer text must be identical, word for word, to the
 * FAQPage JSON-LD, and both must be generated from the same object.
 *
 * They are — which is exactly why this test matters. Generating from one
 * source makes the guarantee true by construction, and a test is what stops
 * someone later "fixing" the JSON-LD by hand and silently breaking it.
 */
interface FaqBlock {
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: { '@type': string; text: string }
  }>
}

const faqBlock = jsonLdBlocks().find((block) => block['@type'] === 'FAQPage') as
  | FaqBlock
  | undefined

describe('FAQPage JSON-LD (FR-805)', () => {
  it('is present exactly once', () => {
    const blocks = jsonLdBlocks().filter((block) => block['@type'] === 'FAQPage')
    expect(blocks).toHaveLength(1)
  })

  it('carries every FAQ item, in order', () => {
    expect(faqBlock).toBeDefined()
    expect(faqBlock!.mainEntity).toHaveLength(FAQ.items.length)
    expect(FAQ.items.length).toBe(8)
  })

  it('matches the rendered questions and answers word for word', () => {
    const fromSchema = faqBlock!.mainEntity.map((entry) => ({
      question: entry.name,
      answer: entry.acceptedAnswer.text,
    }))
    const fromContent = FAQ.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    }))

    expect(fromSchema).toEqual(fromContent)
  })

  it('uses the schema.org types the Rich Results test expects', () => {
    for (const entry of faqBlock!.mainEntity) {
      expect(entry['@type']).toBe('Question')
      expect(entry.acceptedAnswer['@type']).toBe('Answer')
    }
  })

  it('has no empty answer', () => {
    for (const entry of faqBlock!.mainEntity) {
      expect(entry.acceptedAnswer.text.trim().length).toBeGreaterThan(0)
    }
  })
})
