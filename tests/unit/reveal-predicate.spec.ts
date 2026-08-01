import { describe, expect, it } from 'vitest'
import { isHalfVisible } from '~/composables/useReveal'

/**
 * DECISIONS.md C3: `section_viewed` fires at 50% visibility, but a plain
 * intersectionRatio >= 0.5 can never be true for an element taller than twice
 * the viewport. Several sections are, at 375px, so the predicate has a second
 * arm. These cases are why it exists.
 */
function entry(options: {
  ratio: number
  intersectionHeight: number
  viewportHeight: number
}): IntersectionObserverEntry {
  return {
    intersectionRatio: options.ratio,
    intersectionRect: { height: options.intersectionHeight } as DOMRectReadOnly,
    rootBounds: { height: options.viewportHeight } as DOMRectReadOnly,
  } as IntersectionObserverEntry
}

describe('isHalfVisible', () => {
  it('is true when half the element is showing', () => {
    expect(
      isHalfVisible(entry({ ratio: 0.5, intersectionHeight: 100, viewportHeight: 800 })),
    ).toBe(true)
  })

  it('is false when only a sliver of a short element shows', () => {
    expect(
      isHalfVisible(entry({ ratio: 0.2, intersectionHeight: 40, viewportHeight: 800 })),
    ).toBe(false)
  })

  it('is true for a section taller than the viewport that fills half of it', () => {
    // 3000px section on a 667px viewport: the ratio can never reach 0.5, but
    // 400px of it is on screen, which is well over half the viewport.
    expect(
      isHalfVisible(entry({ ratio: 0.13, intersectionHeight: 400, viewportHeight: 667 })),
    ).toBe(true)
  })

  it('is false for a tall section only just entering view', () => {
    expect(
      isHalfVisible(entry({ ratio: 0.03, intersectionHeight: 90, viewportHeight: 667 })),
    ).toBe(false)
  })

  it('is exactly at the boundary when the element covers half the viewport', () => {
    expect(
      isHalfVisible(entry({ ratio: 0.1, intersectionHeight: 400, viewportHeight: 800 })),
    ).toBe(true)
    expect(
      isHalfVisible(entry({ ratio: 0.1, intersectionHeight: 399, viewportHeight: 800 })),
    ).toBe(false)
  })

  it('does not divide by zero when rootBounds is unavailable', () => {
    expect(
      isHalfVisible(entry({ ratio: 0.1, intersectionHeight: 100, viewportHeight: 0 })),
    ).toBe(false)
  })
})
