<script setup lang="ts">
import { PROOF_CELLS } from '~/content/site'

/**
 * FR-300 series. Full bleed ink band. FR-304: a 2x2 grid below 768px, never a
 * horizontal scroller.
 *
 * FR-303: every value and label comes from PLACEHOLDERS, so no number is ever
 * hardcoded in this template.
 */
</script>

<template>
  <SectionShell id="proof" v-slot="{ headingId }" variant="ink" bleed flush>
    <h2 :id="headingId" class="visually-hidden">Track record</h2>

    <!-- min-w-0 on each cell defeats the grid item's default min-width:auto,
         which otherwise refuses to shrink below the widest unbreakable token.
         With a placeholder like TODO_PROOF_3 at 32px that forced 412px of
         content into a 320px viewport. -->
    <ul class="grid grid-cols-2 md:grid-cols-4">
      <li
        v-for="(cell, index) in PROOF_CELLS"
        :key="cell.label"
        data-testid="proof-cell"
        class="border-paper/15 flex min-h-96 min-w-0 flex-col justify-center px-24 py-24"
        :class="[index % 2 === 1 ? 'border-l' : '', index >= 2 ? 'border-t md:border-t-0' : '', index === 2 ? 'md:border-l' : '']"
      >
        <p class="font-primary text-proof break-words">{{ cell.value }}</p>
        <p class="font-mono text-mono-label mt-6 uppercase opacity-70">
          {{ cell.label }}
        </p>
      </li>
    </ul>
  </SectionShell>
</template>
