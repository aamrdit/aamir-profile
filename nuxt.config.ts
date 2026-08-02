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

  // D11: every third party is env-gated. Unset means the feature simply does
  // not render, so the suite stays green without keys.
  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      plausibleDomain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '',
      // Vercel Analytics and Speed Insights are served from /_vercel/*, which
      // only exists on a Vercel deployment. Injecting them anywhere else
      // produces 404s and console errors, which 01-page-load rightly fails on.
      vercelEnv: process.env.VERCEL_ENV ?? '',
    },
  },

  css: ['~/assets/css/main.css'],

  // Section 7 nests components under layout/, sections/ and ui/ but refers to
  // them by bare name. pathPrefix: false keeps <SectionShell> rather than
  // <UiSectionShell>.
  components: [{ path: '~/components', pathPrefix: false }],

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
      // SEO-01 fixes the title exactly. @nuxtjs/seo otherwise appends
      // " | Aamir Butt" via its default titleTemplate, pushing it over 60
      // characters and duplicating the name.
      titleTemplate: '%s',
      script: [
        {
          // Runs before first paint so #collapse never flashes from its end
          // state to its start state. Setting this after hydration would cost
          // a visible swap and CLS. See DECISIONS.md C4.
          innerHTML:
            "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}",
          tagPosition: 'head',
          tagPriority: 'critical',
        },
      ],
    },
  },

  site: {
    url: 'https://aamirbutt.com',
    name: 'Aamir Butt',
    defaultLocale: 'en-GB',
  },

  /**
   * Pinned to IPX. Left on auto, @nuxt/image detects Vercel and switches to
   * Vercel Image Optimization, emitting /_vercel/image?url=... instead of
   * /_ipx/... That endpoint only exists at runtime, so the prerender crawler
   * hit it during the build, got a 404, and failOnError killed the deploy.
   *
   * IPX also keeps three things the spec wants: variants generated at build
   * time into static files (C12, and FR-009's "no route renders on demand"),
   * the /_ipx/** content-type rule that stops WebP being served as JPEG
   * (M2.2), and no dependency on a paid runtime image service for one
   * 512px portrait.
   */
  image: { provider: 'ipx' },

  // C11: @nuxtjs/seo bundles nuxt-og-image, which pulls in satori. SEO-04
  // specifies a separately designed static /images/og.jpg, so it stays off.
  ogImage: { enabled: false },

  // SEO-07: AI crawlers are allowed explicitly. Discovery is the goal here, so
  // blocking them would work against the point of the site.
  robots: {
    groups: [
      { userAgent: ['*'], allow: ['/'], disallow: ['/thanks'] },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
        ],
        allow: ['/'],
      },
    ],
  },

  sitemap: {
    // /thanks is a post-submission confirmation, not a landing page.
    exclude: ['/thanks'],
  },

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
      routes: [
        '/',
        '/thanks',
        '/legal',
        '/llms.txt',
        '/aamir-butt.md',
        // The image variants. Under the node-server preset @nuxt/image emits
        // these as a side effect of the build, but under the Vercel preset it
        // does not, leaving the HTML pointing at /_ipx/ URLs that 404. Listing
        // them keeps every image a static file on both presets, which is what
        // FR-009 and C12 ask for. scripts/check-bans.mjs fails the build if an
        // /_ipx/ src in the built HTML has no matching file, so this list
        // cannot silently go stale.
        '/_ipx/f_webp&q_82&s_240x240/images/aamir-butt-profile.jpg',
        '/_ipx/f_webp&q_82&s_480x480/images/aamir-butt-profile.jpg',
        '/_ipx/f_webp&q_82&s_180x180/images/aamir-butt-profile.jpg',
        '/_ipx/f_webp&q_82&s_360x360/images/aamir-butt-profile.jpg',
      ],
      failOnError: true,
    },
  },

  routeRules: {
    // @nuxt/image writes its build-time variants to paths ending in .jpg even
    // when the bytes are WebP, so extension-based MIME detection mislabels
    // them as image/jpeg. 05-media asserts the content-type, and browsers
    // should not be told the wrong format either. Mirrored in vercel.json.
    '/_ipx/**': {
      headers: {
        'content-type': 'image/webp',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/': { prerender: true },
    '/thanks': { prerender: true },
    '/legal': { prerender: true },
  },

  features: {
    /**
     * Off. Inlining was enabled at M2 and did help while the page was small,
     * but once every section landed the CSS grew and inlining it into each
     * prerendered document cost more than the request it saved: total blocking
     * time measured consistently higher with it on, and a single cacheable
     * stylesheet is better across the three routes. See DECISIONS.md M8.
     */
    inlineStyles: false,
  },
})
