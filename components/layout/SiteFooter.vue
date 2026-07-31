<script setup lang="ts">
import { FOOTER, SITE } from '~/content/site'

/**
 * FR-912: ink background, three columns collapsing to one at sm.
 * FR-913: every external link carries target="_blank" and
 * rel="noopener noreferrer", with a visible text label rather than an icon.
 * SEO-10: /aamir-butt.md is linked with rel="alternate".
 */
</script>

<template>
  <footer id="footer" data-testid="footer" class="bg-ink text-paper section-pad">
    <div class="shell grid gap-48 sm:grid-cols-3">
      <div>
        <h2 class="font-mono text-mono-label uppercase opacity-60">
          {{ FOOTER.contactHeading }}
        </h2>
        <a
          :href="SITE.mailto"
          class="text-paper font-primary mt-12 inline-flex min-h-48 items-center underline decoration-1 underline-offset-4"
        >
          {{ SITE.email }}
        </a>
      </div>

      <div>
        <h2 class="font-mono text-mono-label uppercase opacity-60">
          {{ FOOTER.socialHeading }}
        </h2>
        <ul class="mt-12 flex flex-col">
          <li v-for="item in FOOTER.social" :key="item.testid">
            <a
              :href="item.href"
              :data-testid="item.testid"
              target="_blank"
              rel="noopener noreferrer"
              class="text-paper font-primary inline-flex min-h-48 items-center underline decoration-1 underline-offset-4"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="font-mono text-mono-label uppercase opacity-60">
          {{ FOOTER.legalHeading }}
        </h2>
        <ul class="mt-12 flex flex-col">
          <li>
            <NuxtLink
              to="/legal"
              class="text-paper font-primary inline-flex min-h-48 items-center underline decoration-1 underline-offset-4"
            >
              {{ FOOTER.legalLinkLabel }}
            </NuxtLink>
          </li>
          <!-- SEO-10 adds the rel="alternate" link to /aamir-butt.md here at
               M7, when that machine asset is generated. Linking it now would
               ship a 404. -->
        </ul>
      </div>
    </div>

    <div class="shell border-rule/30 mt-48 flex flex-col gap-6 border-t pt-24">
      <p data-testid="last-updated" class="font-mono text-mono-label uppercase opacity-60">
        {{ FOOTER.lastUpdatedLabel }}
      </p>
      <p class="font-mono text-mono-label uppercase opacity-60">{{ FOOTER.copyright }}</p>
    </div>
  </footer>
</template>
