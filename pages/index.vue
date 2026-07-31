<script setup lang="ts">
import {
  ABOUT,
  AVAILABILITY,
  COLLAPSE,
  CONTACT,
  ENGAGE,
  FAQ,
  HERO,
  META,
  PROOF_CELLS,
  SERVICES,
  SITE,
  TOOLKIT,
  WORK,
} from '~/content/site'

/**
 * M1 layout shell. The eleven sections carry their final IDs, headings and
 * aria-labelledby contracts; their interiors are filled in at M2 to M6.
 */
useHead({
  title: META.title,
  link: [{ rel: 'canonical', href: `${SITE.url}/` }],
})
useSeoMeta({ description: META.description })
</script>

<template>
  <div>
    <SkipLink />
    <SiteNav />

    <!-- FR-005: the skip link moves focus here, so it must be focusable. -->
    <main id="main" tabindex="-1">
      <SectionShell id="hero" v-slot="{ headingId }" flush>
        <div class="flex min-h-svh flex-col justify-center py-96">
          <EyebrowLabel dot>{{ HERO.eyebrow }}</EyebrowLabel>
          <h1 :id="headingId" class="font-primary text-h1 measure-display mt-24">
            {{ HERO.h1 }}
          </h1>
          <p class="font-primary text-body measure-tight mt-24">{{ HERO.standfirst }}</p>
          <div class="mt-36 flex flex-wrap items-center gap-24">
            <CtaButton href="#contact" testid="cta-primary-hero">
              {{ HERO.ctaPrimary }}
            </CtaButton>
            <CtaLink href="#engage" testid="cta-secondary-hero">
              {{ HERO.ctaSecondary }}
            </CtaLink>
          </div>
          <p class="font-mono text-mono-label mt-36 uppercase">{{ HERO.micro }}</p>
        </div>
      </SectionShell>

      <!-- FR-301: full bleed ink band. FR-304: 2x2 below 768px, never a scroller. -->
      <SectionShell id="proof" v-slot="{ headingId }" variant="ink" bleed flush>
        <h2 :id="headingId" class="visually-hidden">Track record</h2>
        <ul class="grid grid-cols-2 md:grid-cols-4">
          <li
            v-for="(cell, index) in PROOF_CELLS"
            :key="cell.label"
            data-testid="proof-cell"
            class="border-paper/15 flex flex-col justify-center px-24 py-36"
            :class="{ 'border-l': index > 0 }"
          >
            <p class="font-primary text-proof">{{ cell.value }}</p>
            <p class="font-mono text-mono-label mt-6 uppercase opacity-70">
              {{ cell.label }}
            </p>
          </li>
        </ul>
      </SectionShell>

      <SectionShell id="collapse" v-slot="{ headingId }">
        <EyebrowLabel>{{ COLLAPSE.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ COLLAPSE.h2 }}</h2>
        <p class="font-primary text-body measure-prose mt-24">{{ COLLAPSE.body }}</p>
      </SectionShell>

      <SectionShell id="services" v-slot="{ headingId }" variant="paper-alt">
        <EyebrowLabel>{{ SERVICES.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ SERVICES.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ SERVICES.body }}</p>
      </SectionShell>

      <SectionShell id="engage" v-slot="{ headingId }">
        <EyebrowLabel>{{ ENGAGE.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ ENGAGE.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ ENGAGE.body }}</p>
      </SectionShell>

      <SectionShell id="work" v-slot="{ headingId }">
        <EyebrowLabel>{{ WORK.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ WORK.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ WORK.body }}</p>
      </SectionShell>

      <SectionShell id="toolkit" v-slot="{ headingId }" variant="paper-alt">
        <EyebrowLabel>{{ TOOLKIT.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ TOOLKIT.h2 }}</h2>
      </SectionShell>

      <SectionShell id="about" v-slot="{ headingId }">
        <EyebrowLabel>{{ ABOUT.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ ABOUT.h2 }}</h2>
      </SectionShell>

      <SectionShell id="availability" v-slot="{ headingId }" variant="paper-alt">
        <EyebrowLabel>{{ AVAILABILITY.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ AVAILABILITY.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ AVAILABILITY.body }}</p>
        <div class="mt-36">
          <CtaButton href="#contact" testid="cta-primary-availability">
            {{ HERO.ctaPrimary }}
          </CtaButton>
        </div>
      </SectionShell>

      <SectionShell id="faq" v-slot="{ headingId }">
        <EyebrowLabel>{{ FAQ.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ FAQ.h2 }}</h2>
      </SectionShell>

      <SectionShell id="contact" v-slot="{ headingId }">
        <EyebrowLabel>{{ CONTACT.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ CONTACT.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ CONTACT.body }}</p>
        <a
          :href="SITE.mailto"
          data-testid="mailto-link"
          class="text-ink font-primary mt-24 inline-flex min-h-48 items-center underline decoration-1 underline-offset-4"
        >
          {{ CONTACT.emailLine }}
        </a>
      </SectionShell>
    </main>

    <SiteFooter />
  </div>
</template>
