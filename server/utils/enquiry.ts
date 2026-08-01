import { enquiryRequestSchema, fieldErrors } from '~/schemas/enquiry'

/**
 * The decision logic behind POST /api/enquiry, kept free of any h3 or Nitro
 * import so it can be unit tested directly against injected dependencies.
 * server/api/enquiry.post.ts is a thin adapter over this.
 *
 * FR-911: nothing is stored, and neither IP addresses nor user agents are read
 * or logged anywhere here. That is a compliance requirement (Section 17.3).
 */

export interface EnquiryDeps {
  /** Returns true when the token is accepted. */
  verifyTurnstile: (token: string | undefined) => Promise<boolean>
  /** Throws on provider failure. */
  sendMail: (input: { subject: string; text: string }) => Promise<void>
  turnstileConfigured: boolean
  mailConfigured: boolean
  log: (message: string) => void
}

export interface EnquiryResult {
  status: number
  body: Record<string, unknown>
}

function honeypotFilled(raw: unknown): boolean {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    typeof (raw as { website?: unknown }).website === 'string' &&
    (raw as { website: string }).website.length > 0
  )
}

export async function processEnquiry(
  raw: unknown,
  deps: EnquiryDeps,
): Promise<EnquiryResult> {
  const parsed = enquiryRequestSchema.safeParse(raw)

  if (!parsed.success) {
    // A filled honeypot is discarded silently with a 200, so a bot cannot tell
    // acceptance from rejection (Section 14).
    if (honeypotFilled(raw)) return { status: 200, body: { ok: true } }

    return { status: 400, body: { ok: false, errors: fieldErrors(parsed.error) } }
  }

  const enquiry = parsed.data

  // FR-910: a missing or invalid token is a 400. Only enforced when Turnstile
  // is configured -- without keys the form would be unsubmittable (D11).
  if (deps.turnstileConfigured) {
    const accepted = await deps.verifyTurnstile(enquiry.turnstileToken)
    if (!accepted) {
      return {
        status: 400,
        body: { ok: false, errors: { form: 'That check did not pass. Try again.' } },
      }
    }
  }

  if (!deps.mailConfigured) {
    // Failing visibly beats accepting an enquiry and dropping it. The mailto
    // link in the contact section remains a working fallback.
    deps.log('enquiry: RESEND_API_KEY is not set, cannot forward')
    return { status: 500, body: { ok: false, error: 'Could not send the enquiry.' } }
  }

  const text = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Company: ${enquiry.company || '(not given)'}`,
    `Timeline: ${enquiry.timeline}`,
    '',
    enquiry.message,
  ].join('\n')

  try {
    await deps.sendMail({ subject: `Contract enquiry from ${enquiry.name}`, text })
  } catch {
    // Generic message, and never a stack trace in the response body.
    deps.log('enquiry: mail provider rejected the send')
    return { status: 500, body: { ok: false, error: 'Could not send the enquiry.' } }
  }

  return { status: 200, body: { ok: true } }
}
