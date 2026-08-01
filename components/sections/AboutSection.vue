<script setup lang="ts">
import { ABOUT, SITE } from '~/content/site'

/**
 * FR-802. A 5/7 split with the portrait on the LEFT, deliberately breaking the
 * hero's rhythm. 180px square, same treatment, no caption. Pull quote at 28px
 * with a brass opening rule.
 *
 * The portrait is below the fold here, so it is lazy -- unlike the hero's,
 * which is the LCP element.
 */
</script>

<template>
  <SectionShell id="about" v-slot="{ headingId }">
    <div class="grid gap-48 md:grid-cols-12">
      <div class="md:col-span-5">
        <div class="bg-paper-alt border-rule w-full border p-24">
          <NuxtImg
            src="/images/aamir-butt-profile.jpg"
            :alt="ABOUT.portraitAlt"
            data-testid="about-image"
            width="180"
            height="180"
            format="webp"
            quality="82"
            loading="lazy"
            class="portrait-about rounded-max block"
          />
        </div>
      </div>

      <div class="min-w-0 md:col-span-7">
        <EyebrowLabel>{{ ABOUT.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ ABOUT.h2 }}</h2>

        <p
          v-for="paragraph in ABOUT.paragraphs"
          :key="paragraph.slice(0, 24)"
          class="font-primary text-body measure-prose mt-24"
        >
          {{ paragraph }}
        </p>

        <blockquote class="border-brass mt-48 border-t pt-24">
          <p class="font-primary text-quote measure-prose">{{ ABOUT.pullQuote }}</p>
        </blockquote>

        <p class="mt-36">
          <a
            :href="SITE.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-ink font-primary inline-flex min-h-48 items-center underline decoration-1 underline-offset-4"
          >
            {{ ABOUT.linkedinLine }}
          </a>
        </p>
      </div>
    </div>
  </SectionShell>
</template>
