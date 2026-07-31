<script setup lang="ts">
import { NAV } from '~/content/site'

/**
 * FR-005: first focusable element in the DOM, visually hidden until focused,
 * moves focus into <main>. <main> carries tabindex="-1" so the target is
 * programmatically focusable.
 */
</script>

<template>
  <a href="#main" data-testid="skip-link" class="skip-link">{{ NAV.skipLabel }}</a>
</template>
