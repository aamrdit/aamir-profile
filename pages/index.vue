<script setup lang="ts">
import { META, SECTION_IDS, SITE, jsonLdBlocks } from '~/content/site'

/**
 * The single page. Each of the eleven sections owns its own ID, heading and
 * aria-labelledby contract via SectionShell; this file only orders them.
 */
useHead({
  title: META.title,
  link: [{ rel: 'canonical', href: `${SITE.url}/` }],
  // SEO-08: four blocks, all generated from content/site.ts.
  script: jsonLdBlocks().map((block) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(block),
  })),
})

useSeoMeta({
  description: META.description,
  ogTitle: META.title,
  ogDescription: META.description,
  ogType: 'profile',
  ogUrl: `${SITE.url}/`,
  ogImage: `${SITE.url}/images/og.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${SITE.name}, ${SITE.role}`,
  ogLocale: 'en_GB',
  twitterCard: 'summary_large_image',
  twitterSite: SITE.xHandle,
  twitterCreator: SITE.xHandle,
  twitterImage: `${SITE.url}/images/og.jpg`,
  twitterImageAlt: `${SITE.name}, ${SITE.role}`,
})

// Section 13. `section_viewed` fires exactly once per section at 50%
// visibility; the predicate handles sections taller than the viewport (C3).
const { track } = useAnalytics()

useReveal(
  () => SECTION_IDS.map((id) => document.getElementById(id)),
  (element) => track({ name: 'section_viewed', props: { section_id: element.id } }),
)

// scroll_depth, also via observers rather than a scroll listener.
const DEPTHS = [25, 50, 75, 100] as const
useReveal(
  () => DEPTHS.map((d) => document.getElementById(`depth-${d}`)),
  (element) => {
    const depth = Number(element.id.replace('depth-', '')) as (typeof DEPTHS)[number]
    track({ name: 'scroll_depth', props: { depth } })
  },
  { predicate: (entry) => entry.isIntersecting },
)
</script>

<template>
  <div>
    <SkipLink />
    <SiteNav />

    <!-- FR-005: the skip link moves focus here, so it must be focusable. -->
    <main id="main" tabindex="-1" class="relative">
      <span id="depth-25" aria-hidden="true" class="depth-probe depth-25" />
      <span id="depth-50" aria-hidden="true" class="depth-probe depth-50" />
      <span id="depth-75" aria-hidden="true" class="depth-probe depth-75" />
      <span id="depth-100" aria-hidden="true" class="depth-probe depth-100" />

      <HeroSection />
      <ProofStrip />
      <CollapseSection />
      <ServicesSection />
      <EngageSection />
      <WorkSection />
      <ToolkitSection />
      <AboutSection />
      <AvailabilitySection />
      <FaqSection />

      <ContactSection />
    </main>

    <SiteFooter />
  </div>
</template>
