<script setup lang="ts">
import { FAQ } from '~/content/site'

const { track } = useAnalytics()

function onToggle(index: number, event: Event) {
  const details = event.target as HTMLDetailsElement
  if (details.open) track({ name: 'faq_expand', props: { question_index: index } })
}

/**
 * FR-804. Native <details> and <summary>. No JavaScript accordion and no
 * custom ARIA widget: the native element is keyboard accessible for free and
 * stays crawlable (Section 18).
 *
 * FR-805: this same FAQ.items array generates the FAQPage JSON-LD at M7, so
 * the rendered answers and the structured data cannot drift apart.
 */
</script>

<template>
  <SectionShell id="faq" v-slot="{ headingId }">
    <EyebrowLabel>{{ FAQ.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ FAQ.h2 }}</h2>

    <div class="mt-72">
      <details
        v-for="(item, index) in FAQ.items"
        :key="item.question"
        data-testid="faq-item"
        class="border-rule border-t"
        :open="index === 0"
        @toggle="onToggle(index, $event)"
      >
        <summary
          data-testid="faq-summary"
          class="font-primary text-h3 flex min-h-48 cursor-pointer items-center py-18"
        >
          {{ item.question }}
        </summary>
        <p class="font-primary text-body measure-prose pb-24">{{ item.answer }}</p>
      </details>
    </div>
  </SectionShell>
</template>
