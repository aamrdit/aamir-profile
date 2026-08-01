/**
 * Section 13's analytics contract. Event names are fixed and implemented
 * exactly as written, because dashboards depend on them.
 *
 * Cookieless only, so no consent banner is required (Section 17.4). Plausible
 * is loaded only when NUXT_PUBLIC_PLAUSIBLE_DOMAIN is set (DECISIONS.md C7);
 * without it these calls are no-ops rather than failed requests.
 */

export type AnalyticsEvent =
  | { name: 'cta_primary_click'; props: { location: 'nav' | 'hero' | 'availability' } }
  | { name: 'cta_secondary_click'; props: { location: string; label: string } }
  | { name: 'email_link_click'; props: { location: string } }
  | { name: 'linkedin_click'; props: { location: string } }
  | { name: 'x_click'; props: { location: string } }
  | { name: 'collapse_animation_viewed'; props: { reduced_motion: boolean } }
  | { name: 'section_viewed'; props: { section_id: string } }
  | { name: 'faq_expand'; props: { question_index: number } }
  | { name: 'form_start'; props: Record<string, never> }
  | { name: 'form_submit_attempt'; props: Record<string, never> }
  | { name: 'form_submit_success'; props: { timeline: string } }
  | { name: 'form_submit_error'; props: { error_type: string } }
  | { name: 'scroll_depth'; props: { depth: 25 | 50 | 75 | 100 } }
  | { name: 'pdf_download'; props: Record<string, never> }

type Tracker = (name: string, props: Record<string, unknown>) => void

interface AnalyticsWindow extends Window {
  /** Test seam: when present it receives every event instead of Plausible. */
  __track?: Tracker
  plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void
}

export function useAnalytics() {
  function track(event: AnalyticsEvent) {
    if (import.meta.server) return

    const w = window as AnalyticsWindow
    const props = event.props as Record<string, unknown>

    // Stubbable so tests can count calls, per Section 13.
    if (typeof w.__track === 'function') {
      w.__track(event.name, props)
      return
    }

    w.plausible?.(event.name, { props })
  }

  return { track }
}
