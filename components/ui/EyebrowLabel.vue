<script setup lang="ts">
/**
 * Mono eyebrow label. FR-203 adds an 8px brass dot on the hero variant; the
 * dot is decorative and hidden from assistive technology.
 */
withDefaults(defineProps<{ dot?: boolean }>(), { dot: false })
</script>

<template>
  <p class="font-mono text-mono-label text-ink flex items-center gap-12 uppercase">
    <span
      v-if="dot"
      aria-hidden="true"
      class="bg-brass inline-block size-8 shrink-0"
    />
    <span><slot /></span>
  </p>
</template>
