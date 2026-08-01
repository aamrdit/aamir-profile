<script setup lang="ts">
import { CONTACT, SITE } from '~/content/site'

const { track } = useAnalytics()

/**
 * FR-902: two columns. Left carries the H2, one sentence and a real mailto
 * link; right carries the form.
 *
 * FR-010: with JavaScript disabled the form cannot submit, so the mailto link
 * is the fallback -- and it is always visible, not tucked into a <noscript>.
 */
</script>

<template>
  <SectionShell id="contact" v-slot="{ headingId }">
    <div class="grid gap-48 md:grid-cols-12">
      <div class="md:col-span-5">
        <EyebrowLabel>{{ CONTACT.eyebrow }}</EyebrowLabel>
        <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ CONTACT.h2 }}</h2>
        <p class="font-primary text-body measure-tight mt-24">{{ CONTACT.body }}</p>

        <a
          :href="SITE.mailto"
          data-testid="mailto-link"
          class="text-ink font-primary mt-24 inline-flex min-h-48 items-center break-words underline decoration-1 underline-offset-4"
          @click="track({ name: 'email_link_click', props: { location: 'contact' } })"
        >
          {{ CONTACT.emailLine }}
        </a>
      </div>

      <div class="min-w-0 md:col-span-7">
        <!-- Hydrated eagerly, deliberately. Deferring it saved ~15KB of
             client script, but it left a window in which the form is visible
             and fillable yet not interactive: a submit landing before
             hydration falls through to a native form post and loses the
             enquiry. This is the page's only conversion mechanism, so that
             risk is not worth the bytes. See DECISIONS.md M8.13. -->
        <EnquiryForm />
      </div>
    </div>
  </SectionShell>
</template>
