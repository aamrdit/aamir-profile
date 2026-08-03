<script setup lang="ts">
import { WORK } from '~/content/site'

/**
 * FR-700 series. A stacked list separated by 1px rules -- no cards. A mono
 * index in a narrow left column, content in a wide right column.
 *
 * FR-704: no organisation is named anywhere in this section. That is a hard
 * compliance requirement (Section 17.1), not a style preference, and it is why
 * the sector reads at the level of "a global hospitality and membership group
 * operating 40+ sites" once Aamir fills it in.
 */
</script>

<template>
  <SectionShell id="work" v-slot="{ headingId }">
    <EyebrowLabel>{{ WORK.eyebrow }}</EyebrowLabel>
    <h2 :id="headingId" class="font-primary text-h2 mt-24">{{ WORK.h2 }}</h2>
    <p class="font-primary text-body measure-tight mt-24">{{ WORK.body }}</p>

    <ol class="mt-72 flex flex-col">
      <li
        v-for="note in WORK.cases"
        :key="note.index"
        data-testid="case-note"
        class="border-rule grid gap-18 border-t py-48 md:grid-cols-12 md:gap-24"
      >
        <div class="md:col-span-3">
          <p class="font-mono text-mono-label text-brass-text uppercase">
            {{ note.index }}
          </p>
          <p class="font-mono text-mono-label mt-12 uppercase opacity-70">
            {{ note.sector }}
          </p>
          <p class="font-mono text-mono-label uppercase opacity-70">
            {{ note.duration }}
          </p>
        </div>

        <dl class="min-w-0 md:col-span-9">
          <template v-for="part in note.parts" :key="part.label">
            <dt class="font-mono text-mono-label mt-18 uppercase first:mt-0">
              {{ part.label }}
            </dt>
            <dd class="font-primary text-body measure-prose mt-6 break-words">
              {{ part.text }}
            </dd>
          </template>
        </dl>
      </li>
    </ol>
  </SectionShell>
</template>
