<script setup lang="ts">
// C13: preloading both above-fold Switzer faces closes the font-display: swap
// window, which is the CLS mitigation. Importing with ?url gives the hashed
// build URL rather than a guessed path.
import switzer400 from '~/assets/fonts/switzer-400.woff2?url'
import switzer500 from '~/assets/fonts/switzer-500.woff2?url'

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
  ],
})
</script>

<template>
  <NuxtPage />
</template>
