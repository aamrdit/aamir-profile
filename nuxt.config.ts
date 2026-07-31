import tailwindcss from '@tailwindcss/vite'

// Section 7 of CLAUDE.md mandates a root-level tree (components/, pages/,
// assets/, composables/). Nuxt 4 defaults to an app/ srcDir, so srcDir is
// pinned to '.' to keep the specified layout. See DECISIONS.md.
export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',
  srcDir: '.',
  serverDir: 'server',

  // FR-009: every route statically prerendered at build time.
  ssr: true,

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false, // run explicitly via `pnpm typecheck`
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        verbatimModuleSyntax: true,
      },
    },
  },

  // FR-002: <html lang="en-GB">.
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
    },
  },

  site: {
    url: 'https://aamirbutt.com',
    name: 'Aamir Butt',
    defaultLocale: 'en-GB',
  },

  // C11: @nuxtjs/seo bundles nuxt-og-image, which pulls in satori. SEO-04
  // specifies a separately designed static /images/og.jpg, so it stays off.
  ogImage: { enabled: false },

  // D7: three self-hosted woff2 faces declared by hand in assets/css/main.css.
  // Every remote provider is disabled so the module cannot fetch a fourth file.
  fonts: {
    providers: {
      google: false,
      googleicons: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      adobe: false,
    },
  },

  // FR-009 / M0: prerender all three routes. /api/enquiry remains a function.
  nitro: {
    // Section 3's JS budget is 120KB *gzipped*. Lighthouse measures transfer
    // size, so without pre-compression the local preview server reports raw
    // bytes and the budget is measured against the wrong number. This also
    // matches how Vercel serves the assets in production.
    compressPublicAssets: { gzip: true, brotli: true },

    prerender: {
      crawlLinks: true,
      routes: ['/', '/thanks', '/legal'],
      failOnError: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/thanks': { prerender: true },
    '/legal': { prerender: true },
  },

  features: {
    // No global CSS transitions; motion is opt-in per FR-006 and Section 6.
    inlineStyles: false,
  },
})
