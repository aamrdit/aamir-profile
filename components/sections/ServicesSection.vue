<script setup lang="ts">
import { SERVICES } from '~/content/site'

/**
 * FR-500 series. Three columns at lg, two plus one full width at md, stacked
 * at sm. Paper cards on a paper-alt section, 1px rule border, no shadow.
 */
</script>

<template>
  <SectionShell id="services" v-slot="{ headingId }" variant="paper-alt">
    <EyebrowLabel>{{ SERVICES.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ SERVICES.h2 }}</h2>
    <p class="font-primary text-body measure-tight mt-24">{{ SERVICES.body }}</p>

    <ul class="mt-72 grid gap-24 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(track, index) in SERVICES.tracks"
        :key="track.eyebrow"
        data-testid="service-card"
        class="bg-paper border-rule rounded-max flex min-w-0 flex-col border p-24"
        :class="index === 2 ? 'md:col-span-2 lg:col-span-1' : ''"
      >
        <p class="font-mono text-mono-label text-brass-text uppercase">
          {{ track.eyebrow }}
        </p>
        <h3 class="font-primary text-h3 mt-12">{{ track.heading }}</h3>
        <p class="font-primary text-body measure-prose mt-12">{{ track.description }}</p>

        <ul class="mt-24 flex flex-col gap-6">
          <li
            v-for="item in track.deliverables"
            :key="item"
            class="border-rule font-primary border-t pt-6"
          >
            {{ item }}
          </li>
        </ul>
      </li>
    </ul>
  </SectionShell>
</template>
