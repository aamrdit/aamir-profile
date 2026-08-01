<script setup lang="ts">
import { ENGAGE } from '~/content/site'

/**
 * FR-600 series. Three engagement models as rows, plus the reserved 16:9
 * container at the foot of the section (FR-602).
 */
</script>

<template>
  <SectionShell id="engage" v-slot="{ headingId }">
    <EyebrowLabel>{{ ENGAGE.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ ENGAGE.h2 }}</h2>
    <p class="font-primary text-body measure-tight mt-24">{{ ENGAGE.body }}</p>

    <ul class="mt-72 flex flex-col">
      <li
        v-for="model in ENGAGE.models"
        :key="model.testid"
        class="border-rule grid gap-12 border-t py-36 md:grid-cols-12 md:gap-24"
      >
        <h3 class="font-primary text-h3 md:col-span-4">{{ model.name }}</h3>

        <p class="font-mono text-mono-label uppercase md:col-span-3">
          {{ model.shape }}
        </p>

        <div class="md:col-span-5">
          <p class="font-primary text-body measure-prose">{{ model.outcome }}</p>
          <CtaLink
            href="#contact"
            :testid="model.testid"
            location="engage"
            :label="model.ctaLabel"
            class="mt-12"
          >
            {{ model.ctaLabel }}
          </CtaLink>
        </div>
      </li>
    </ul>

    <!-- FR-602: a designed placeholder, never an empty gap and never a broken
         <video>. The ratio is in CSS from v1 so adding video later shifts
         nothing. -->
    <div
      data-testid="video-slot"
      class="video-slot border-rule bg-paper-alt mt-72 flex items-center justify-center border"
    >
      <p class="font-mono text-mono-label px-24 text-center uppercase opacity-70">
        {{ ENGAGE.videoSlotLabel }}
      </p>
    </div>
  </SectionShell>
</template>
