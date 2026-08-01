<script setup lang="ts">
import { COLLAPSE } from '~/content/site'

/**
 * FR-400 series. The one orchestrated moment on the page.
 *
 * Both states are always in the DOM; `data-motion` on <html> (set pre-paint)
 * and `data-collapsed` on this section decide what shows. All of the styling
 * lives in main.css -- see the FR-400 block there for why.
 *
 * FR-406: IntersectionObserver, never a scroll listener. FR-407: fires once.
 */
const { track } = useAnalytics()

const section = ref<HTMLElement | null>(null)
const hasCollapsed = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!section.value) return

  // Reduced motion means the end state is already showing; there is nothing to
  // observe and no event worth firing.
  if (document.documentElement.dataset.motion !== 'on') {
    // The end state is already showing, but the section was still seen.
    track({ name: 'collapse_animation_viewed', props: { reduced_motion: true } })
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry?.isIntersecting || hasCollapsed.value) return

      hasCollapsed.value = true
      track({ name: 'collapse_animation_viewed', props: { reduced_motion: false } })
      // FR-407: once. Disconnecting is what guarantees it cannot re-trigger on
      // the way back up.
      observer?.disconnect()
      observer = null
    },
    { threshold: 0.4 },
  )

  observer.observe(section.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <SectionShell id="collapse" v-slot="{ headingId }">
    <EyebrowLabel>{{ COLLAPSE.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ COLLAPSE.h2 }}</h2>
    <p class="font-primary text-body measure-prose mt-24">{{ COLLAPSE.body }}</p>

    <div ref="section" :data-collapsed="hasCollapsed" class="mt-72">
      <div class="collapse-stage">
        <!-- Nine step start state (FR-401). -->
        <ol class="collapse-steps grid grid-cols-1 gap-12 sm:grid-cols-3">
          <li
            v-for="(step, index) in COLLAPSE.steps"
            :key="step.number"
            data-testid="collapse-step"
            :class="`collapse-step idx-${index}`"
            class="border-rule bg-paper rounded-max border p-18"
          >
            <p class="font-mono text-mono-label text-brass-text">{{ step.number }}</p>
            <p class="font-primary mt-6">{{ step.label }}</p>
          </li>
        </ol>

        <!-- Three card end state (FR-403), with the residue rules that are the
             point of the section (FR-404). -->
        <div class="collapse-cards flex gap-18">
          <div class="flex shrink-0 flex-col justify-center gap-6" aria-hidden="true">
            <span
              v-for="n in 6"
              :key="`residue-${n}`"
              data-testid="collapse-residue"
              :class="`collapse-residue idx-${n - 1}`"
              class="bg-brass block h-px w-36"
            />
          </div>

          <ol class="grid flex-1 grid-cols-1 gap-18 sm:grid-cols-3">
            <li
              v-for="(card, index) in COLLAPSE.cards"
              :key="card.number"
              data-testid="collapse-card"
              :class="`collapse-card idx-${index}`"
              class="border-rule bg-paper-alt rounded-max border p-24"
            >
              <p class="font-mono text-mono-label text-brass-text">
                {{ card.number }} {{ card.label }}
              </p>
              <p class="font-mono text-mono-label mt-12 opacity-70">
                {{ card.footnote }}
              </p>
            </li>
          </ol>
        </div>
      </div>

      <!-- FR-408: states what was removed, so nothing is lost when the
           animation cannot be seen. -->
      <p
        data-testid="collapse-caption"
        class="collapse-caption font-mono text-mono-label measure-prose mt-36"
      >
        {{ COLLAPSE.caption }}
      </p>
    </div>
  </SectionShell>
</template>
