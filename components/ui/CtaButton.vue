<script setup lang="ts">
/**
 * Primary CTA. Always a real <a> -- Section 3 bans a div or span with a click
 * handler standing in for one. Ink fill, paper text, radius capped at 2px, no
 * shadow.
 *
 * FR-008: at least 44x44px on touch viewports.
 */
defineProps<{
  href: string
  testid: string
}>()
</script>

<template>
  <a
    :href="href"
    :data-testid="testid"
    class="bg-ink text-paper font-primary rounded-max inline-flex min-h-48 items-center justify-center px-36 py-12 text-center font-medium no-underline transition-opacity duration-150 hover:opacity-80"
  >
    <slot />
  </a>
</template>
