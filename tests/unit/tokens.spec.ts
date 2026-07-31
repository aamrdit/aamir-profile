import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Comments are stripped before asserting. The file documents its own
// deviations in prose -- the D6 note names the 11px value it replaced, and the
// C13 note mentions font-display -- so matching against raw text produces
// false failures.
const css = readFileSync('assets/css/main.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * M0 acceptance: the Section 6 tokens resolve, and there are three font files
 * and no more. Layout and animation are deliberately NOT asserted here --
 * Section 14 forbids testing padding values before the design exists.
 */
describe('design tokens (Section 6)', () => {
  const required = [
    '--color-ink: #16150f',
    '--color-paper: #e9e8e3',
    '--color-paper-alt: #dedcd5',
    '--color-rule: #b4b1a8',
    '--color-brass: #a8843f',
    '--color-brass-text: #7a5f26',
    '--font-primary:',
    '--font-mono:',
    '--content-max: 1440px',
    '--nav-height-desktop: 64px',
    '--nav-height-mobile: 56px',
    '--radius-max: 2px',
  ]

  it.each(required)('defines %s', (token) => {
    expect(css).toContain(token)
  })

  const spacingSteps = [3, 6, 12, 18, 24, 36, 48, 72, 96, 144]
  it.each(spacingSteps)('defines --spacing-%i in multiples of three', (step) => {
    expect(css).toContain(`--spacing-${step}: ${step}px`)
  })

  it('disables Tailwind’s dynamic spacing scale so only the three-based steps exist', () => {
    expect(css).toContain('--spacing: initial')
  })
})

describe('type scale (Section 6, amended by D6)', () => {
  it('sets the H1 clamp with its line height and tracking', () => {
    expect(css).toContain('--text-h1: clamp(2.75rem, 6vw, 5.5rem)')
    expect(css).toContain('--text-h1--line-height: 0.98')
    expect(css).toContain('--text-h1--letter-spacing: -0.03em')
  })

  it('floors the mono label at 12px, not the spec’s 11px (D6)', () => {
    expect(css).toContain('--text-mono-label: clamp(0.75rem, 0.8vw, 0.8125rem)')
    expect(css).not.toContain('0.6875rem')
  })

  it('keeps 0.14em tracking on mono labels', () => {
    expect(css).toContain('--text-mono-label--letter-spacing: 0.14em')
  })
})

describe('Section 3 bans, at source level', () => {
  it('uses no box-shadow', () => {
    expect(css).not.toMatch(/box-shadow\s*:/i)
  })

  it('uses no CSS gradient', () => {
    expect(css).not.toMatch(/(linear|radial|conic)-gradient\s*\(/i)
  })

  it('never sets outline: none without a :focus-visible replacement', () => {
    if (/outline\s*:\s*none/i.test(css)) {
      expect(css).toMatch(/:focus-visible/)
    }
    expect(css).toContain('outline: 2px solid var(--color-brass)')
  })
})

describe('self-hosted faces (D7)', () => {
  const files = readdirSync('assets/fonts')

  it('ships exactly three font files', () => {
    expect(files).toHaveLength(3)
  })

  it('ships woff2 only', () => {
    expect(files.every((file) => file.endsWith('.woff2'))).toBe(true)
  })

  it('declares all three with font-display: swap', () => {
    expect(css.match(/font-display:\s*swap/g)).toHaveLength(3)
  })

  it('uses two families and no serif', () => {
    expect(css).toContain("font-family: 'Switzer'")
    expect(css).toContain("font-family: 'Martian Mono'")
    // Section 6: "No serif anywhere on the page. This is deliberate."
    // sans-serif and ui-sans-serif fallbacks are of course fine.
    expect(css).not.toMatch(/(?<!sans-)serif/)
  })
})
