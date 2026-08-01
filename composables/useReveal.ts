/**
 * IntersectionObserver wrapper. Section 3 bans scroll listeners outright and
 * M3's acceptance asserts zero of them in the built output, so every
 * scroll-position question on this site is answered by an observer.
 *
 * `section_viewed` fires at 50% visibility. A plain `threshold: 0.5` cannot
 * fire for an element taller than twice the viewport -- several sections are,
 * at 375px -- so the predicate is: at least half the element is showing, OR the
 * element covers at least half the viewport. See DECISIONS.md C3.
 */
export function isHalfVisible(entry: IntersectionObserverEntry): boolean {
  if (entry.intersectionRatio >= 0.5) return true

  const viewportHeight = entry.rootBounds?.height ?? 0
  if (viewportHeight === 0) return false

  return entry.intersectionRect.height / viewportHeight >= 0.5
}

export interface RevealOptions {
  /** Fire at most once per element. */
  once?: boolean
  threshold?: number | number[]
  /** Defaults to the half-visible predicate above. */
  predicate?: (entry: IntersectionObserverEntry) => boolean
}

export function useReveal(
  targets: () => Array<Element | null | undefined>,
  onReveal: (element: Element) => void,
  options: RevealOptions = {},
) {
  const { once = true, threshold = [0, 0.25, 0.5, 0.75, 1], predicate = isHalfVisible } =
    options

  let observer: IntersectionObserver | null = null
  const fired = new WeakSet<Element>()

  onMounted(() => {
    const elements = targets().filter((el): el is Element => !!el)
    if (elements.length === 0) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !predicate(entry)) continue
          if (once && fired.has(entry.target)) continue

          fired.add(entry.target)
          onReveal(entry.target)
          if (once) observer?.unobserve(entry.target)
        }
      },
      { threshold },
    )

    for (const element of elements) observer.observe(element)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
