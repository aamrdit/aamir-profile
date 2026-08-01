import { Resend } from 'resend'
import { processEnquiry } from '../utils/enquiry'

/**
 * FR-911: forwards by email via Resend and stores nothing. No database, and no
 * IP address or user agent is read or logged.
 *
 * All decision logic lives in server/utils/enquiry.ts so it can be unit tested
 * without a Nitro server; this is the adapter.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = await processEnquiry(body, {
    turnstileConfigured: !!process.env.TURNSTILE_SECRET,
    mailConfigured: !!process.env.RESEND_API_KEY,

    verifyTurnstile: async (token) => {
      if (!token) return false
      const response = await $fetch<{ success: boolean }>(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: { secret: process.env.TURNSTILE_SECRET, response: token },
        },
      )
      return response.success === true
    },

    sendMail: async ({ subject, text }) => {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { error } = await resend.emails.send({
        from: 'Website enquiry <enquiries@aamirbutt.com>',
        to: 'aamir.butt@outlook.com',
        subject,
        text,
      })
      if (error) throw new Error('send failed')
    },

    log: (message) => console.warn(message),
  })

  setResponseStatus(event, result.status)
  return result.body
})
