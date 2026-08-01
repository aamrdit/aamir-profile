import {
  AVAILABILITY,
  CONTACT,
  ENGAGE,
  FAQ,
  HERO,
  META,
  SERVICES,
  SITE,
} from '~/content/site'

/**
 * SEO-09. Generated from content/site.ts rather than kept as a static file in
 * public/, so it cannot drift from the page. Section 7 places it under
 * public/; this serves the same URL from one source of truth instead. See
 * DECISIONS.md.
 */
export default defineEventHandler((event) => {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${META.description}`,
    '',
    '## Who',
    '',
    HERO.standfirst,
    '',
    '## What I offer',
    '',
    ...SERVICES.tracks.map((t) => `- **${t.heading}** — ${t.description}`),
    '',
    '## How to engage',
    '',
    ...ENGAGE.models.map((m) => `- **${m.name}** (${m.shape}) — ${m.outcome}`),
    '',
    '## Availability',
    '',
    ...AVAILABILITY.rows.map((r) => `- ${r.label}: ${r.value}`),
    '',
    '## Questions',
    '',
    ...FAQ.items.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),
    '## Contact',
    '',
    `- Email: ${SITE.email}`,
    `- LinkedIn: ${SITE.linkedin}`,
    `- X: ${SITE.x}`,
    `- Website: ${SITE.url}`,
    '',
    CONTACT.body,
    '',
  ]

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
