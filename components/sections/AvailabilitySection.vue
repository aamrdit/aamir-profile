<script setup lang="ts">
import { AVAILABILITY, HERO } from '~/content/site'

/**
 * FR-803. A full width paper-alt band holding a box with a 1px ink border.
 * Four rows, mono labels left, values right. The primary CTA repeats here.
 *
 * Rate is disclosed as "on request" with the benchmarking basis stated, per
 * Section 1. No number is published.
 */
</script>

<template>
  <SectionShell id="availability" v-slot="{ headingId }" variant="paper-alt">
    <EyebrowLabel>{{ AVAILABILITY.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ AVAILABILITY.h2 }}</h2>
    <p class="font-primary text-body measure-tight mt-24">{{ AVAILABILITY.body }}</p>

    <dl class="border-ink rounded-max mt-48 border">
      <div
        v-for="(row, index) in AVAILABILITY.rows"
        :key="row.label"
        data-testid="availability-row"
        class="border-ink grid gap-6 p-24 md:grid-cols-12 md:gap-24"
        :class="index > 0 ? 'border-t' : ''"
      >
        <dt class="font-mono text-mono-label uppercase md:col-span-3">{{ row.label }}</dt>
        <dd class="font-primary min-w-0 break-words md:col-span-9">{{ row.value }}</dd>
      </div>
    </dl>

    <div class="mt-36">
      <CtaButton
        href="#contact"
        testid="cta-primary-availability"
        location="availability"
      >
        {{ HERO.ctaPrimary }}
      </CtaButton>
    </div>
  </SectionShell>
</template>
