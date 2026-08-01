import { z } from 'zod'

/**
 * FR-905: one schema, imported by both EnquiryForm.vue and
 * server/api/enquiry.post.ts. No validation rule is written twice.
 *
 * FR-907: error copy states what to fix. It never apologises and never says
 * "invalid input".
 */

export const TIMELINE_VALUES = ['immediate', 'month', 'quarter', 'exploring'] as const

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Enter your name, at least 2 characters.' })
    .max(80, { message: 'Shorten your name to 80 characters or fewer.' }),

  email: z
    .email({ message: 'Enter a work email address, like name@company.com.' })
    .max(254, { message: 'Shorten the email address to 254 characters or fewer.' }),

  company: z
    .string()
    .trim()
    .max(120, { message: 'Shorten the company name to 120 characters or fewer.' })
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .trim()
    .min(20, { message: 'Describe the problem in at least 20 characters.' })
    .max(2000, { message: 'Shorten the description to 2000 characters or fewer.' }),

  timeline: z.enum(TIMELINE_VALUES, {
    message: 'Choose a timeline.',
  }),

  consent: z.literal(true, {
    message: 'Tick the box so I can use your details to reply.',
  }),

  /**
   * FR-904 honeypot. Must be empty. A non-empty value is discarded silently by
   * the server so bots learn nothing from the response.
   */
  website: z.literal('').optional(),
})

export type Enquiry = z.infer<typeof enquirySchema>

/** The client sends the Turnstile token alongside the enquiry (FR-910). */
export const enquiryRequestSchema = enquirySchema.extend({
  turnstileToken: z.string().optional(),
})

export type EnquiryRequest = z.infer<typeof enquiryRequestSchema>

/**
 * Flattens Zod issues to one message per field, which is the shape both the
 * inline errors and the error summary need (FR-907).
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !out[key]) out[key] = issue.message
  }
  return out
}
