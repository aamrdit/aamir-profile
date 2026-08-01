<script setup lang="ts">
import { SITE } from '~/content/site'

/**
 * FR-914: states what is collected, the lawful basis, the retention period and
 * how to request deletion. Linked from the consent checkbox label on the
 * enquiry form.
 *
 * This is legal content and a draft for review, not an approved legal
 * position (Section 17.7). It should be checked before launch.
 */
useHead({ title: 'Privacy notice | Aamir Butt' })
useSeoMeta({
  description:
    'How enquiry details submitted through aamirbutt.com are used, the lawful basis for processing them, how long they are kept, and how to ask for deletion.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div>
    <SkipLink />
    <SiteNav />

    <main id="main" tabindex="-1" class="shell section-pad">
      <h1 class="font-primary text-h1">Privacy notice</h1>
      <p class="font-mono text-mono-label mt-24 uppercase">
        Last updated {{ SITE.lastUpdated }}
      </p>

      <h2 class="font-primary text-h2 mt-72">What is collected</h2>
      <p class="font-primary text-body measure-prose mt-24">
        If you send an enquiry through the form on this site, it collects your name,
        your email address, your company if you choose to give one, the timeline you
        select, and the description you write. Nothing else is collected, and the site
        sets no cookies.
      </p>

      <h2 class="font-primary text-h2 mt-48">How it is used</h2>
      <p class="font-primary text-body measure-prose mt-24">
        Your enquiry is forwarded by email to
        <a
          :href="SITE.mailto"
          class="underline decoration-1 underline-offset-4"
          >{{ SITE.email }}</a
        >
        and is used only to reply to you. It is not stored in any database, not added
        to a mailing list, and not shared with anyone else.
      </p>

      <h2 class="font-primary text-h2 mt-48">Lawful basis</h2>
      <p class="font-primary text-body measure-prose mt-24">
        Legitimate interest in responding to a business enquiry you have chosen to
        send. You can object to this at any time using the contact details below.
      </p>

      <h2 class="font-primary text-h2 mt-48">How long it is kept</h2>
      <p class="font-primary text-body measure-prose mt-24">
        Your enquiry stays in the recipient email account for as long as the
        conversation is live, and is deleted within 12 months of the last message
        unless we are working together and a longer record is needed.
      </p>

      <h2 class="font-primary text-h2 mt-48">Asking for deletion</h2>
      <p class="font-primary text-body measure-prose mt-24">
        Email
        <a
          :href="SITE.mailto"
          class="underline decoration-1 underline-offset-4"
          >{{ SITE.email }}</a
        >
        and ask for your enquiry to be deleted. It will be removed and you will get
        confirmation. You also have the right to ask what is held about you, to have it
        corrected, and to complain to the Information Commissioner's Office.
      </p>

      <h2 class="font-primary text-h2 mt-48">Analytics</h2>
      <p class="font-primary text-body measure-prose mt-24">
        Any analytics used on this site are cookieless and record no personal data, so
        no consent banner is required.
      </p>

      <h2 class="font-primary text-h2 mt-48">Spam protection</h2>
      <p class="font-primary text-body measure-prose mt-24">
        The enquiry form may use Cloudflare Turnstile to tell people from bots. It runs
        only when you interact with the form, and it does not track you across sites.
      </p>
    </main>

    <SiteFooter />
  </div>
</template>
