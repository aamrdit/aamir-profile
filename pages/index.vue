<script setup lang="ts">
// M0 SCRATCH PAGE. Replaced wholesale by the twelve-block layout shell at M1.
// It exists to prove the Section 6 tokens resolve through Tailwind 4's @theme
// and to give the build something to prerender.
useHead({ title: 'Aamir Butt | Automation & Enterprise Architecture Contractor, UK' })
useSeoMeta({
  description:
    'Aamir Butt is an automation and enterprise architecture contractor, available for contract work across the UK and remote. Twenty years of enterprise IT delivery.',
})

const tokens = [
  { name: '--color-ink', class: 'bg-ink text-paper' },
  { name: '--color-paper-alt', class: 'bg-paper-alt text-ink' },
  { name: '--color-rule', class: 'bg-rule text-ink' },
  { name: '--color-brass', class: 'bg-brass text-ink' },
]
</script>

<template>
  <main class="shell section-pad">
    <p class="font-mono text-mono-label text-brass-text uppercase">M0 · Scratch page</p>

    <h1 class="font-primary text-h1 mt-24">Tokens resolve.</h1>

    <p class="font-primary text-body measure-tight mt-24">
      This page exists only to prove the design tokens compile through Tailwind 4's
      <code class="font-mono">@theme</code> block. M1 replaces it with the layout shell.
    </p>

    <h2 class="font-primary text-h2 mt-72">Colour</h2>
    <ul class="mt-24 grid gap-3">
      <li
        v-for="token in tokens"
        :key="token.name"
        class="font-mono text-mono-label rounded-max p-12 uppercase"
        :class="token.class"
      >
        {{ token.name }}
      </li>
    </ul>

    <h2 class="font-primary text-h2 mt-72">Spacing, in multiples of three</h2>
    <div class="border-rule mt-24 flex flex-col gap-6 border p-24">
      <div class="bg-ink h-6 w-12" />
      <div class="bg-ink h-6 w-24" />
      <div class="bg-ink h-6 w-48" />
      <div class="bg-ink h-6 w-96" />
    </div>

    <h2 class="font-primary text-h2 mt-72">Type</h2>
    <p class="font-primary text-h3 mt-24">H3 at 1.375rem, tracking -0.01em.</p>
    <p class="font-mono text-mono-label mt-12 uppercase">
      Mono label, 12px floor per decision D6
    </p>
  </main>
</template>
