<script setup lang="ts">
// FR-915: /thanks contains an H1 "Enquiry received." and is prerendered.
useHead({ title: 'Enquiry received | Aamir Butt' })
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <main class="shell section-pad">
    <h1 class="font-primary text-h1">Enquiry received.</h1>
    <p class="font-primary text-body measure-tight mt-24">
      I will reply within two working days, usually sooner. If it is urgent, connect on
      LinkedIn and say so.
    </p>
  </main>
</template>
