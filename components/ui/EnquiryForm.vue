<script setup lang="ts">
import { CONTACT } from '~/content/site'
import { enquirySchema, fieldErrors } from '~/schemas/enquiry'

/**
 * FR-904 to FR-909. Every field has a visible, persistent <label>; placeholder
 * only labelling is a build failure.
 *
 * Turnstile is loaded on first interaction with the form, not on page load
 * (DECISIONS.md C6), so its weight never touches LCP.
 */
const { track } = useAnalytics()
const config = useRuntimeConfig()
const turnstileSiteKey = config.public.turnstileSiteKey as string

const form = reactive({
  name: '',
  email: '',
  company: '',
  message: '',
  timeline: '',
  consent: false,
  website: '',
})

const errors = ref<Record<string, string>>({})
const serverError = ref('')
const isSubmitting = ref(false)
const summary = ref<HTMLElement | null>(null)
const turnstileToken = ref('')
const turnstileLoaded = ref(false)

const messageLength = computed(() => form.message.trim().length)
const errorList = computed(() => Object.entries(errors.value))

/** C6: pulled in on first interaction, never on page load. */
let hasStarted = false

function onFirstInteraction() {
  if (!hasStarted) {
    hasStarted = true
    track({ name: 'form_start', props: {} })
  }
  loadTurnstile()
}

function loadTurnstile() {
  if (turnstileLoaded.value || !turnstileSiteKey) return
  turnstileLoaded.value = true
  useHead({
    script: [
      {
        src: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
        async: true,
        defer: true,
      },
    ],
  })
}

function describedBy(field: string, extra?: string) {
  const ids = [errors.value[field] ? `error-${field}` : '', extra ?? '']
  const joined = ids.filter(Boolean).join(' ')
  return joined || undefined
}

async function onSubmit() {
  // FR-908: rapid repeat presses must fire exactly one network request.
  if (isSubmitting.value) return

  serverError.value = ''
  track({ name: 'form_submit_attempt', props: {} })
  const parsed = enquirySchema.safeParse({ ...form })

  if (!parsed.success) {
    errors.value = fieldErrors(parsed.error)
    track({ name: 'form_submit_error', props: { error_type: 'validation' } })
    // FR-907: the summary takes focus so the failure is announced.
    await nextTick()
    summary.value?.focus()
    return
  }

  errors.value = {}
  isSubmitting.value = true

  try {
    await $fetch('/api/enquiry', {
      method: 'POST',
      body: { ...parsed.data, turnstileToken: turnstileToken.value || undefined },
    })
    track({ name: 'form_submit_success', props: { timeline: parsed.data.timeline } })
    await navigateTo('/thanks')
  } catch {
    // FR-909: input is retained and the user stays on the page.
    track({ name: 'form_submit_error', props: { error_type: 'server' } })
    serverError.value = CONTACT.serverErrorMessage
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    data-testid="enquiry-form"
    novalidate
    class="flex flex-col gap-24"
    @submit.prevent="onSubmit"
    @focusin.once="onFirstInteraction"
  >
    <!-- FR-907: summary above the form, focusable, listing what to fix. -->
    <div
      v-if="errorList.length"
      ref="summary"
      data-testid="error-summary"
      tabindex="-1"
      role="alert"
      class="border-ink rounded-max border p-18"
    >
      <p class="font-primary font-medium">{{ CONTACT.errorSummaryHeading }}</p>
      <ul class="mt-12 flex flex-col gap-6">
        <li v-for="[field, message] in errorList" :key="field">
          <a :href="`#field-${field}`" class="font-primary underline underline-offset-4">
            {{ message }}
          </a>
        </li>
      </ul>
    </div>

    <div v-if="serverError" data-testid="form-error-banner" role="alert" class="border-ink rounded-max border p-18">
      <p class="font-primary">{{ serverError }}</p>
    </div>

    <div class="flex flex-col gap-6">
      <label for="field-name" class="font-mono text-mono-label uppercase">
        {{ CONTACT.fields.name.label }}
      </label>
      <input
        id="field-name"
        v-model="form.name"
        data-testid="field-name"
        name="name"
        type="text"
        autocomplete="name"
        required
        :aria-invalid="!!errors.name"
        :aria-describedby="describedBy('name')"
        class="border-rule bg-paper rounded-max min-h-48 border px-12"
      />
      <p v-if="errors.name" id="error-name" data-testid="error-name" class="font-primary">
        {{ errors.name }}
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <label for="field-email" class="font-mono text-mono-label uppercase">
        {{ CONTACT.fields.email.label }}
      </label>
      <input
        id="field-email"
        v-model="form.email"
        data-testid="field-email"
        name="email"
        type="email"
        autocomplete="email"
        required
        :aria-invalid="!!errors.email"
        :aria-describedby="describedBy('email')"
        class="border-rule bg-paper rounded-max min-h-48 border px-12"
      />
      <p v-if="errors.email" id="error-email" data-testid="error-email" class="font-primary">
        {{ errors.email }}
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <label for="field-company" class="font-mono text-mono-label uppercase">
        {{ CONTACT.fields.company.label }}
      </label>
      <input
        id="field-company"
        v-model="form.company"
        data-testid="field-company"
        name="company"
        type="text"
        autocomplete="organization"
        class="border-rule bg-paper rounded-max min-h-48 border px-12"
      />
    </div>

    <div class="flex flex-col gap-6">
      <label for="field-message" class="font-mono text-mono-label uppercase">
        {{ CONTACT.fields.message.label }}
      </label>
      <textarea
        id="field-message"
        v-model="form.message"
        data-testid="field-message"
        name="message"
        rows="6"
        required
        :aria-invalid="!!errors.message"
        :aria-describedby="describedBy('message', 'message-counter')"
        class="border-rule bg-paper rounded-max border p-12"
      />
      <p id="message-counter" aria-live="polite" class="font-mono text-mono-label">
        {{ messageLength }} / 2000
      </p>
      <p v-if="errors.message" id="error-message" data-testid="error-message" class="font-primary">
        {{ errors.message }}
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <label for="field-timeline" class="font-mono text-mono-label uppercase">
        {{ CONTACT.fields.timeline.label }}
      </label>
      <select
        id="field-timeline"
        v-model="form.timeline"
        data-testid="field-timeline"
        name="timeline"
        required
        :aria-invalid="!!errors.timeline"
        :aria-describedby="describedBy('timeline')"
        class="border-rule bg-paper rounded-max min-h-48 border px-12"
      >
        <option value="" disabled>Choose one</option>
        <option v-for="option in CONTACT.timelineOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <p v-if="errors.timeline" id="error-timeline" data-testid="error-timeline" class="font-primary">
        {{ errors.timeline }}
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- The label wraps the control, so the whole row is the tap target
           (FR-008) rather than a 24px box. `for` is kept as well: the
           accessibility spec asserts an explicit label association. -->
      <label for="field-consent" class="checkbox-target font-primary">
        <input
          id="field-consent"
          v-model="form.consent"
          data-testid="field-consent"
          name="consent"
          type="checkbox"
          required
          :aria-invalid="!!errors.consent"
          :aria-describedby="describedBy('consent')"
          class="mt-6 size-24 shrink-0"
        />
        <span>
          {{ CONTACT.consentLabel }}
          <!-- .stop so following the link does not also toggle consent, which
               a link nested in a label otherwise does. -->
          <NuxtLink to="/legal" class="underline underline-offset-4" @click.stop>
            Privacy notice
          </NuxtLink>
        </span>
      </label>
      <p v-if="errors.consent" id="error-consent" data-testid="error-consent" class="font-primary">
        {{ errors.consent }}
      </p>
    </div>

    <!-- FR-904 honeypot: visually hidden, out of the tab order, hidden from
         assistive technology. A real person never sees or reaches it. -->
    <div class="visually-hidden" aria-hidden="true">
      <label for="field-honeypot">Leave this field empty</label>
      <input
        id="field-honeypot"
        v-model="form.website"
        data-testid="field-honeypot"
        name="website"
        type="text"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div v-if="turnstileSiteKey" class="cf-turnstile" :data-sitekey="turnstileSiteKey" />

    <div>
      <button
        type="submit"
        data-testid="submit-enquiry"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
        class="bg-ink text-paper font-primary rounded-max inline-flex min-h-48 items-center justify-center px-36 py-12 font-medium disabled:opacity-70"
      >
        {{ isSubmitting ? CONTACT.submittingLabel : CONTACT.submitLabel }}
      </button>
    </div>
  </form>
</template>
