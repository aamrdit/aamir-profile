<script setup lang="ts">
/**
 * Secondary CTA. A real <a>, underlined, with a 44px minimum touch target
 * (FR-008). Ink text on paper -- brass is never used for text (Section 6).
 */
const props = defineProps<{
  href: string
  testid: string
  location: string
  label: string
}>()

const { track } = useAnalytics()

function onClick() {
  track({
    name: 'cta_secondary_click',
    props: { location: props.location, label: props.label },
  })
}
</script>

<template>
  <a
    :href="href"
    :data-testid="testid"
    class="text-ink font-primary inline-flex min-h-48 items-center underline decoration-1 underline-offset-4 transition-opacity duration-150 hover:opacity-70"
    @click="onClick"
  >
    <slot />
  </a>
</template>
