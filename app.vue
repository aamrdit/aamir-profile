<script setup lang="ts">
// C13: preloading both above-fold Switzer faces closes the font-display: swap
// window, which is the CLS mitigation. Importing with ?url gives the hashed
// build URL rather than a guessed path.
import switzer400 from '~/assets/fonts/switzer-400.woff2?url'
import switzer500 from '~/assets/fonts/switzer-500.woff2?url'

const config = useRuntimeConfig()
const plausibleDomain = config.public.plausibleDomain as string

useHead({
  link: [
    {
      rel: 'preload',
      href: switzer400,
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      href: switzer500,
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
    // SEO-05: a mono AB wordmark, not the photograph. Photographs do not read
    // at 32px.
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    { rel: 'icon', href: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    { rel: 'icon', href: '/icon-512.png', type: 'image/png', sizes: '512x512' },
  ],
  meta: [{ name: 'theme-color', content: '#16150F' }],
  script: plausibleDomain
    ? [
        {
          // Cookieless, so no consent banner is required (Section 17.4).
          // Rendered only when the domain is configured, so local and CI runs
          // emit no third-party request at all (DECISIONS.md C7).
          src: 'https://plausible.io/js/script.js',
          defer: true,
          'data-domain': plausibleDomain,
        },
      ]
    : [],
})
</script>

<template>
  <NuxtPage />
</template>
