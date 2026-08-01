<script setup lang="ts">
import { HERO } from '~/content/site'

/**
 * FR-200 series. 7/5 split on a 12 column grid at md and above, stacking to
 * type-then-portrait below 768px (FR-202).
 *
 * The portrait is the LCP element (FR-209) and is never upscaled: the source
 * is 512x512 and the display box caps at 240 CSS px.
 */
</script>

<template>
  <SectionShell id="hero" v-slot="{ headingId }" flush>
    <div class="hero-frame grid items-center gap-48 py-96 md:grid-cols-12">
      <div class="md:col-span-7">
        <div class="hero-rise rise-0">
          <EyebrowLabel dot>{{ HERO.eyebrow }}</EyebrowLabel>
        </div>

        <!-- FR-204: author-controlled breaks at lg and above, natural wrapping
             below, so the three lines are deliberate rather than accidental. -->
        <h1
          :id="headingId"
          class="font-primary text-h1 measure-display hero-rise rise-1 mt-24"
        >
          <template v-for="(line, index) in HERO.h1Lines" :key="line">
            {{ line
            }}<br v-if="index < HERO.h1Lines.length - 1" class="hidden lg:inline" />
            <span v-if="index < HERO.h1Lines.length - 1" class="lg:hidden"> </span>
          </template>
        </h1>

        <p class="font-primary text-body measure-tight hero-rise rise-2 mt-24">
          {{ HERO.standfirst }}
        </p>

        <div class="hero-rise rise-3 mt-36 flex flex-wrap items-center gap-24">
          <CtaButton href="#contact" testid="cta-primary-hero" location="hero">
            {{ HERO.ctaPrimary }}
          </CtaButton>
          <CtaLink
            href="#engage"
            testid="cta-secondary-hero"
            location="hero"
            :label="HERO.ctaSecondary"
          >
            {{ HERO.ctaSecondary }}
          </CtaLink>
        </div>

        <p class="font-mono text-mono-label hero-rise rise-4 mt-36 uppercase">
          {{ HERO.micro }}
        </p>
      </div>

      <!-- FR-208: square portrait on a paper-alt panel, overlapping the panel
           edge by 24px. The offset applies from md up so it cannot push a 320px
           viewport into horizontal overflow. -->
      <div class="md:col-span-5">
        <!-- Sized to the column, not to content. w-fit resolved to the mono
             caption's unwrapped max-content width and overflowed a 320px
             viewport by 92px. -->
        <div class="bg-paper-alt border-rule w-full max-w-full border p-24 md:ml-24">
          <NuxtImg
            src="/images/aamir-butt-profile.jpg"
            :alt="HERO.portraitAlt"
            data-testid="hero-image"
            width="240"
            height="240"
            format="webp"
            quality="82"
            loading="eager"
            fetchpriority="high"
            preload
            class="portrait-hero rounded-max block md:-mt-48 md:-ml-48"
          />
          <p class="font-mono text-mono-label mt-24 uppercase">
            {{ HERO.portraitCaption }}
          </p>
        </div>
      </div>
    </div>

    <!-- FR-210: hidden below 768px, and removed outright under reduced motion
         since its entire content is the animation. -->
    <div class="hidden pb-48 md:motion-safe:flex md:items-center md:gap-12">
      <span class="bg-brass rule-grow block h-48 w-px" aria-hidden="true" />
      <span class="font-mono text-mono-label uppercase">{{ HERO.scrollLabel }}</span>
    </div>
  </SectionShell>
</template>
