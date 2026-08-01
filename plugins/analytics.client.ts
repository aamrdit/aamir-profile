/**
 * Vercel Analytics and Speed Insights. Both are served same-origin from
 * /_vercel/*, so neither counts against Section 3's two third-party request
 * budget -- that is what leaves room for Plausible and Turnstile
 * (DECISIONS.md C5).
 *
 * They are loaded only on an actual Vercel deployment. Everywhere else
 * /_vercel/* does not exist, so injecting them would emit 404s and console
 * errors -- precisely what 01-page-load asserts against.
 *
 * The imports are dynamic so neither package lands in the initial chunk. A
 * static import would ship both to every visitor regardless of the gate below.
 *
 * Section 7 does not list a plugins/ directory; this is the conventional place
 * for client-only initialisation in Nuxt. See DECISIONS.md.
 */
export default defineNuxtPlugin(() => {
  const { vercelEnv } = useRuntimeConfig().public
  if (!vercelEnv) return

  const mode = vercelEnv === 'production' ? 'production' : 'development'

  void import('@vercel/analytics').then(({ inject }) => inject({ mode }))
  void import('@vercel/speed-insights').then(({ injectSpeedInsights }) =>
    injectSpeedInsights(),
  )
})
