<script setup lang="ts">
import type { SectionId } from '~/content/site'

/**
 * FR-004: every section is a <section> with aria-labelledby pointing at its
 * own heading ID. This component owns the id, the labelling contract, the
 * vertical rhythm and the background step, so no section component repeats
 * them.
 *
 * The heading itself is the consumer's job and MUST carry `${id}-heading`,
 * which `headingId` exposes for convenience.
 */
const props = withDefaults(
  defineProps<{
    id: SectionId
    /** Background step. Depth comes from 1px rules and steps only (Section 6). */
    variant?: 'paper' | 'paper-alt' | 'ink'
    /** Full-bleed bands (the proof strip) opt out of the padded shell. */
    bleed?: boolean
    /** Sections that manage their own vertical rhythm, e.g. the 100svh hero. */
    flush?: boolean
  }>(),
  { variant: 'paper', bleed: false, flush: false },
)

const headingId = computed(() => `${props.id}-heading`)

const variantClass = computed(
  () =>
    ({
      paper: 'bg-paper text-ink',
      'paper-alt': 'bg-paper-alt text-ink',
      ink: 'bg-ink text-paper',
    })[props.variant],
)
</script>

<template>
  <section :id="id" :aria-labelledby="headingId" :class="[variantClass, { 'section-pad': !flush }]">
    <div :class="bleed ? 'w-full' : 'shell'">
      <slot :heading-id="headingId" />
    </div>
  </section>
</template>
