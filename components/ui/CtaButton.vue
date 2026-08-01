<script setup lang="ts">
/**
 * Primary CTA. Always a real <a> -- Section 3 bans a div or span with a click
 * handler standing in for one. Ink fill, paper text, radius capped at 2px, no
 * shadow.
 *
 * FR-008: at least 44x44px on touch viewports; min-h-48 satisfies that on the
 * three-based spacing scale.
 */
const props = defineProps<{
  href: string
  testid: string
  location: 'nav' | 'hero' | 'availability'
}>()

const { track } = useAnalytics()

function onClick() {
  track({ name: 'cta_primary_click', props: { location: props.location } })
}
</script>

<template>
  <a
    :href="href"
    :data-testid="testid"
    class="bg-ink text-paper font-primary rounded-max inline-flex min-h-48 items-center justify-center px-36 py-12 text-center font-medium no-underline transition-opacity duration-150 hover:opacity-80"
    @click="onClick"
  >
    <slot />
  </a>
</template>
