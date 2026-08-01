<script setup lang="ts">
import { TOOLKIT } from '~/content/site'

/**
 * FR-801. Four grouped text lists, 4 up at lg, 2x2 at md, stacked at sm.
 * No third party logos and no invented certifications (Section 17.6).
 */
</script>

<template>
  <SectionShell id="toolkit" v-slot="{ headingId }" variant="paper-alt">
    <EyebrowLabel>{{ TOOLKIT.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ TOOLKIT.h2 }}</h2>

    <div class="mt-72 grid gap-36 md:grid-cols-2 lg:grid-cols-4">
      <section v-for="group in TOOLKIT.groups" :key="group.heading" class="min-w-0">
        <h3 class="font-mono text-mono-label border-rule border-t pt-12 uppercase">
          {{ group.heading }}
        </h3>
        <ul class="mt-12 flex flex-col gap-6">
          <li v-for="item in group.items" :key="item" class="font-primary">
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </SectionShell>
</template>
