/**
 * Single source of truth for every string and every configurable value on the
 * site. Section 9: "All copy lives in content/site.ts. Never inline a string
 * in a template."
 *
 * Anything factual is a PLACEHOLDER below and renders as a literal TODO_
 * marker until Aamir fills it. scripts/check-placeholders.mjs blocks a
 * production build while any remain (FR-901).
 */

// ---------------------------------------------------------------------------
// Section 5: placeholders the human must fill
// ---------------------------------------------------------------------------

/**
 * Values marked "from CV" are derived from Aamir's own CV (Profile.pdf,
 * 08/07/2026) and are DRAFTS pending his written confirmation — launch
 * checklist item 12. Nothing here is invented; anything the CV does not
 * state remains a TODO_ marker and keeps blocking a production build.
 */
export const PLACEHOLDERS = {
  // CV: earliest listed role January 2003, so 23 years to date. Kept as '20+'
  // to stay consistent with the hero standfirst and the About heading, which
  // both say twenty years.
  YEARS_EXPERIENCE: '20+',
  PROOF_1_VALUE: '20+ yrs',
  PROOF_1_LABEL: 'ENTERPRISE IT',
  // CV: "baseline model and maintain data and technical maps for 50+ products
  // and associated services". NOTE: the CV says products and services; this
  // label says systems integrated. Confirm or correct the wording.
  PROOF_2_VALUE: '50+',
  PROOF_2_LABEL: 'SYSTEMS INTEGRATED',
  // NOT IN THE CV. The only figure it carries is a 25K annual cost reduction,
  // which is a saving, not programme value. Aamir must supply this.
  PROOF_3_VALUE: 'TODO_PROOF_3',
  PROOF_3_LABEL: 'PROGRAMME VALUE DELIVERED',
  // CV: travel and e-commerce, hospitality and membership, finance and
  // banking, marketing, technology consultancy.
  PROOF_4_VALUE: '5',
  PROOF_4_LABEL: 'SECTORS',
  // NOT IN THE CV, and not derivable: the CV shows a role running to
  // "Present". Both are Aamir's to decide.
  AVAILABLE_FROM: 'TODO_DATE', // DD/MM/YYYY
  NOTICE_PERIOD: 'TODO_NOTICE', // e.g. '2 weeks'
} as const

// ---------------------------------------------------------------------------
// Section 1: locked project parameters
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'Aamir Butt',
  role: 'Automation & Enterprise Architecture Contractor',
  url: 'https://aamirbutt.com',
  email: 'aamir.butt@outlook.com',
  locale: 'en-GB',
  /** FR-903: this exact string, including the encoded subject. */
  mailto: 'mailto:aamir.butt@outlook.com?subject=Contract%20enquiry%20via%20website',
  /** The slug uses a single 'a'. This is correct and MUST NOT be "fixed". */
  linkedin: 'https://www.linkedin.com/in/amir-butt-741a9937/',
  x: 'https://x.com/aamirbutt',
  xHandle: '@aamirbutt',
  /** FR-912. DD/MM/YYYY per Section 1. */
  lastUpdated: '31/07/2026',
  copyrightYear: 2026,
} as const

/** SEO-01 and SEO-02. Title under 60 chars; description 150-158 chars. */
export const META = {
  title: 'Aamir Butt | Automation & Enterprise Architecture Contractor, UK',
  description:
    'Aamir Butt is an automation and enterprise architecture contractor available for contract work across the UK and remote. Twenty years of delivery.',
} as const

// ---------------------------------------------------------------------------
// FR-001: the thirteen block IDs, in order. These are anchor targets,
// analytics keys and test selectors. They MUST NOT be renamed.
//
// Eleven of them are <section> elements; `nav` and `footer` are the header and
// footer landmarks. See DECISIONS.md C1 -- the spec says "twelve blocks" but
// lists thirteen IDs.
// ---------------------------------------------------------------------------

export const BLOCK_IDS = [
  'nav',
  'hero',
  'proof',
  'collapse',
  'services',
  'engage',
  'work',
  'toolkit',
  'about',
  'availability',
  'faq',
  'contact',
  'footer',
] as const

export const SECTION_IDS = [
  'hero',
  'proof',
  'collapse',
  'services',
  'engage',
  'work',
  'toolkit',
  'about',
  'availability',
  'faq',
  'contact',
] as const

export type BlockId = (typeof BLOCK_IDS)[number]
export type SectionId = (typeof SECTION_IDS)[number]

// ---------------------------------------------------------------------------
// Nav. The primary CTA was removed from the nav entirely -- DECISIONS.md D5.
// ---------------------------------------------------------------------------

export const NAV = {
  wordmark: 'AAMIR BUTT',
  menuLabel: 'Menu',
  closeLabel: 'Close',
  skipLabel: 'Skip to content',
  links: [
    { testid: 'nav-link-work', label: 'Work', href: '#work' },
    { testid: 'nav-link-availability', label: 'Availability', href: '#availability' },
    { testid: 'nav-link-contact', label: 'Contact', href: '#contact' },
  ],
} as const

// ---------------------------------------------------------------------------
// Section 9: copy deck
// ---------------------------------------------------------------------------

export const HERO = {
  eyebrow: 'AVAILABLE FOR CONTRACT · UK & REMOTE',
  h1: 'Automation that survives contact with your organisation.',
  /** FR-204: author-controlled breaks at lg and above, natural wrapping below. */
  h1Lines: [
    'Automation that',
    'survives contact with',
    'your organisation.',
  ],
  standfirst:
    'Twenty years of enterprise architecture and technical delivery, now pointed at the harder half of automation: deciding what to automate, designing it so it holds, and getting it live.',
  ctaPrimary: 'Start a conversation',
  ctaSecondary: 'See how I work',
  micro: 'ENTERPRISE ARCHITECTURE · TRANSFORMATION · TECHNICAL PROGRAMME DELIVERY',
  portraitAlt: 'Aamir Butt',
  portraitCaption: 'AAMIR BUTT · LONDON & REMOTE',
  scrollLabel: 'SCROLL',
} as const

/** FR-303: values and labels come from PLACEHOLDERS, never hardcoded. */
export const PROOF_CELLS = [
  { value: PLACEHOLDERS.PROOF_1_VALUE, label: PLACEHOLDERS.PROOF_1_LABEL },
  { value: PLACEHOLDERS.PROOF_2_VALUE, label: PLACEHOLDERS.PROOF_2_LABEL },
  { value: PLACEHOLDERS.PROOF_3_VALUE, label: PLACEHOLDERS.PROOF_3_LABEL },
  { value: PLACEHOLDERS.PROOF_4_VALUE, label: PLACEHOLDERS.PROOF_4_LABEL },
] as const

export const COLLAPSE = {
  eyebrow: 'THE WORK',
  h2: 'Most automation projects fail at step four.',
  body: 'Here is a supplier onboarding process as it usually exists. Nine steps, four handoffs, two spreadsheets and one person who knows how it really works. Automating it step for step just makes the wrong process faster. Redesigning it first is the difference between a pilot and a change.',
  caption: 'Six steps removed, not automated. That is usually where the value is.',
  /**
   * FR-401: nine sequential steps of supplier onboarding and purchase order
   * approval. Section 9 supplies this section's prose but not the step labels,
   * so these are authored -- generic process vocabulary, naming no
   * organisation and asserting nothing factual. See DECISIONS.md.
   */
  steps: [
    { number: '01', label: 'Supplier request raised' },
    { number: '02', label: 'Manual due diligence' },
    { number: '03', label: 'Finance review' },
    { number: '04', label: 'Spreadsheet reconciliation' },
    { number: '05', label: 'Contract drafting' },
    { number: '06', label: 'Approval chase' },
    { number: '07', label: 'Master data entry' },
    { number: '08', label: 'PO raised' },
    { number: '09', label: 'Invoice matching' },
  ],
  /** FR-403: the three-card end state, each footnoting the steps it absorbed. */
  cards: [
    {
      number: '01',
      label: 'DESIGN',
      footnote: 'Absorbs steps 01–03: request, due diligence and finance review.',
      absorbs: ['01', '02', '03'],
    },
    {
      number: '02',
      label: 'AUTOMATE',
      footnote: 'Absorbs steps 04–07: reconciliation, drafting, chasing and data entry.',
      absorbs: ['04', '05', '06', '07'],
    },
    {
      number: '03',
      label: 'GOVERN',
      footnote: 'Absorbs steps 08–09: purchase order and invoice matching.',
      absorbs: ['08', '09'],
    },
  ],
} as const

export const SERVICES = {
  eyebrow: 'WHAT I DO',
  h2: 'Three tracks, one discipline.',
  body: 'Whether the engagement is labelled architecture, transformation or automation, the work is the same: understand the estate, decide what should change, and make the change stick.',
  /**
   * FR-502 requires a two sentence description per card. Section 9's copy deck
   * supplies the eyebrow, heading and deliverables but not the description, so
   * these three are authored in the deck's voice. Positioning copy, not
   * factual claims -- and a draft for review like everything else (Section 17.7).
   */
  tracks: [
    {
      eyebrow: 'TRACK 01',
      heading: 'Automation design and delivery',
      description:
        'Finding the processes worth automating, then designing automation that holds once it meets real volume and real exceptions. Delivered through to live, not to pilot.',
      deliverables: [
        'Process discovery and prioritisation',
        'Automation architecture',
        'Build oversight',
        'Live handover',
      ],
    },
    {
      eyebrow: 'TRACK 02',
      heading: 'Enterprise architecture and transformation',
      description:
        'Mapping the estate as it is, agreeing what it should become, and sequencing the change so the organisation can absorb it. Architecture that survives contact with delivery.',
      deliverables: [
        'Current and target state models',
        'Integration strategy',
        'Technology roadmap',
        'Governance model',
      ],
    },
    {
      eyebrow: 'TRACK 03',
      heading: 'Technical programme delivery',
      description:
        'Running the plan, the vendors and the dependencies so a programme actually lands. Accountable for go live, not just for the governance pack.',
      deliverables: [
        'Delivery planning',
        'Vendor and supplier management',
        'Risk and dependency control',
        'Go live',
      ],
    },
  ],
} as const

export const ENGAGE = {
  eyebrow: 'HOW WE WORK TOGETHER',
  h2: 'Three ways in.',
  body: 'Short and scoped, embedded and accountable, or on hand when you need a senior second opinion.',
  models: [
    {
      testid: 'cta-engage-1',
      name: 'Automation discovery sprint',
      shape: '2 to 3 weeks, fixed scope',
      outcome:
        'A ranked automation backlog with effort, dependency and value estimates',
      ctaLabel: 'Discuss a discovery sprint',
    },
    {
      testid: 'cta-engage-2',
      name: 'Embedded contract',
      shape: '3 to 12 months, day rate',
      outcome: 'Architecture ownership or delivery ownership on a live programme',
      ctaLabel: 'Discuss an embedded contract',
    },
    {
      testid: 'cta-engage-3',
      name: 'Architecture advisory',
      shape: 'Retained, small monthly commitment',
      outcome: 'Design review, assurance, and a senior second opinion on the record',
      ctaLabel: 'Discuss advisory support',
    },
  ],
  videoSlotLabel: 'A short introduction will sit here.',
} as const

export const WORK = {
  eyebrow: 'EVIDENCE',
  h2: 'Selected engagements.',
  body: 'Client names withheld. Happy to talk specifics under NDA.',
  /**
   * FR-703 / FR-704. The four-part format is mandatory and no organisation may
   * be named -- a hard compliance requirement. Each note's body is a single
   * placeholder until Aamir writes it.
   */
  /**
   * Drafted from Aamir's CV and anonymised to sector level. FR-704 and Section
   * 17.1 forbid naming any organisation, so no employer or client appears here
   * even though the CV names five. Every outcome carries a number, per
   * Section 5.
   *
   * DRAFT pending written confirmation (checklist item 12). Note also that
   * these were permanent roles rather than client engagements; the section is
   * headed "Selected engagements", so Aamir should be comfortable with that
   * framing before launch.
   */
  cases: [
    {
      index: 'CASE 01',
      sector: 'Hospitality and membership',
      duration: '5 years',
      parts: [
        {
          label: 'Context',
          text: 'A global hospitality and membership group running a mixed estate of member-facing and back-office systems across its sites.',
        },
        {
          label: 'Problem',
          text: 'Business requirements arrived faster than they could be translated into buildable technical designs, and delivery was split across in-house, offshore and multiple vendor locations.',
        },
        {
          label: 'What I did',
          text: 'Owned the translation of business needs into technical system designs and the documentation developers and testers worked from, and ran delivery across the vendor and offshore teams end to end.',
        },
        {
          label: 'Outcome',
          text: 'Delivery held to schedule and quality against an aggressive timeline while coordinating 6 to 8 contract resources alongside offshore teams.',
        },
      ],
    },
    {
      index: 'CASE 02',
      sector: 'Travel and experiences marketing',
      duration: '3 years 8 months',
      parts: [
        {
          label: 'Context',
          text: 'A travel and experiences marketing business with a large product portfolio and no shared view of how its data, processes and infrastructure fitted together.',
        },
        {
          label: 'Problem',
          text: 'Sprint teams were making architectural decisions without a baseline to work from, so constraints surfaced late and roadmaps were built on assumption.',
        },
        {
          label: 'What I did',
          text: 'Built and maintained TOGAF-style baseline models of the estate, supplied architectural frameworks to the sprint teams, and held design authority sign-off during sprints.',
        },
        {
          label: 'Outcome',
          text: 'Data and technical maps covering 50+ products and associated services, giving product managers a factual basis for roadmap decisions.',
        },
      ],
    },
    {
      index: 'CASE 03',
      sector: 'Digital services consultancy',
      duration: '3 years',
      parts: [
        {
          label: 'Context',
          text: 'A digital services consultancy delivering e-commerce, mobile and CMS products for external clients while running its own back office on manual process.',
        },
        {
          label: 'Problem',
          text: 'Internal administration was absorbing cost and effort that should have been going into client delivery.',
        },
        {
          label: 'What I did',
          text: 'Specified and implemented a replacement back-office system alongside the client delivery programme, and coordinated the cross-functional offshore teams involved.',
        },
        {
          label: 'Outcome',
          text: 'Annual operating cost reduced by GBP 25,000, with the saving recurring year on year.',
        },
      ],
    },
  ],
  /**
   * Section 5 makes this format mandatory: exactly four labelled parts, one to
   * two sentences each, the outcome containing at least one number, and no
   * organisation named anywhere (FR-704 -- a compliance requirement, not a
   * style preference). Rendering the labels with the placeholder under each
   * shows Aamir exactly what has to be written.
   */
  partLabels: ['Context', 'Problem', 'What I did', 'Outcome'],
} as const

export const TOOLKIT = {
  eyebrow: 'CAPABILITY',
  h2: 'What I bring to the estate.',
  groups: [
    {
      heading: 'ARCHITECTURE',
      items: [
        'TOGAF style modelling',
        'Integration patterns',
        'API strategy',
        'Data flow design',
        'Target operating models',
      ],
    },
    {
      heading: 'AUTOMATION AND AI',
      items: [
        'Workflow automation',
        'LLM assisted process design',
        'Agentic tooling',
        'Evaluation and guardrails',
        'Human in the loop design',
      ],
    },
    {
      heading: 'DELIVERY',
      items: [
        'Agile and hybrid delivery',
        'Programme governance',
        'Vendor management',
        'Migration and cutover',
      ],
    },
    {
      heading: 'PLATFORM',
      items: [
        'Cloud platforms',
        'Identity and access',
        'Security and compliance',
        'Legacy integration',
      ],
    },
  ],
} as const

export const ABOUT = {
  eyebrow: 'ABOUT',
  h2: 'I have spent twenty years learning why good systems fail.',
  paragraphs: [
    'My background is enterprise architecture and technical programme delivery, which is a formal way of saying I have spent two decades in the space between what a business wants and what its systems will actually allow.',
    'That is why automation interests me now. The tooling has finally caught up with the ambition, and the constraint has moved. The hard part is no longer whether something can be automated. It is whether the process deserves to exist in the first place, and whether the organisation around it can absorb the change.',
    'I take on contract work where that judgement is the thing being hired, not just the delivery capacity.',
  ],
  pullQuote: 'The technology was never the bottleneck.',
  linkedinLine: 'More detail on LinkedIn',
  portraitAlt: 'Aamir Butt',
} as const

export const AVAILABILITY = {
  eyebrow: 'COMMERCIALS',
  h2: 'Availability and terms, up front.',
  body: 'You are probably triaging several candidates. Here is everything you need to rule me in or out.',
  rows: [
    { label: 'STATUS', value: `Available from ${PLACEHOLDERS.AVAILABLE_FROM}` },
    { label: 'ENGAGEMENT', value: 'Contract, UK and remote. Outside IR35 preferred.' },
    {
      label: 'RATE',
      value:
        'Indicative day rate on request, benchmarked to UK market rates for senior automation and architecture roles.',
    },
    { label: 'NOTICE', value: PLACEHOLDERS.NOTICE_PERIOD },
  ],
} as const

/**
 * FR-805: the rendered answer text and the FAQPage JSON-LD are generated from
 * this one array, so they cannot drift. Questions are verbatim from Section 9;
 * answers are Aamir's to write.
 */
export const FAQ = {
  eyebrow: 'QUESTIONS',
  h2: 'Before you ask.',
  /**
   * Six of the eight are drafted from positioning already agreed in the copy
   * deck (the availability rows and the engagement models) or from the CV.
   * Question 1 stays a TODO because it depends on AVAILABLE_FROM, which only
   * Aamir can set. All eight are drafts for his review, and FR-805 means
   * whatever is written here is exactly what the FAQPage JSON-LD publishes.
   */
  items: [
    {
      question: 'Are you available for contract work right now?',
      answer: 'TODO_FAQ_1',
    },
    {
      question: 'Do you work inside or outside IR35?',
      answer: 'Outside IR35 by preference, and most of the work I take on is scoped that way. I will look at an inside IR35 engagement if the brief genuinely warrants it, but it is not the default.',
    },
    {
      question: 'What is your day rate?',
      answer: 'On request. I benchmark to UK market rates for senior automation and architecture contracting, and I would rather quote against a real scope than publish a number that means nothing without one.',
    },
    {
      question: 'Do you work remotely or on site?',
      answer: 'Remote by default, UK-wide. I am London-based and happy to be on site for discovery, workshops and the points in a programme where being in the room actually changes the outcome.',
    },
    {
      question: 'What kind of automation work do you take on?',
      answer: 'Work where deciding what to automate is the hard part. Process discovery and prioritisation, automation architecture, oversight of the build, and handover into live. I am less useful where the answer is already agreed and you just need extra hands.',
    },
    {
      question: 'Are you a developer or an architect?',
      answer: 'An architect who has been a developer, and still reads the code. My background runs from lead developer through solutions architect to technical delivery, which is why I tend to be hired where design decisions and delivery reality have to meet.',
    },
    {
      question: 'What size of organisation do you usually work with?',
      answer: 'Mostly larger organisations with estates that have grown complicated: multiple products, several vendors, offshore delivery and legacy that cannot simply be switched off. That is where the judgement is worth paying for.',
    },
    {
      question: 'How do we start?',
      answer: 'Usually a short discovery sprint, two to three weeks at fixed scope, ending in a ranked automation backlog with effort, dependency and value estimates. If you already know what you need built, we can skip straight to an embedded contract.',
    },
  ],
} as const

export const CONTACT = {
  eyebrow: 'NEXT STEP',
  h2: 'Tell me what you are trying to change.',
  body: 'A short description of the problem is more useful to both of us than a job specification. I reply to everything within two working days.',
  emailLine: `Or email me directly at ${SITE.email}`,
  submitLabel: 'Send enquiry',
  submittingLabel: 'Sending',
  consentLabel:
    'I agree to my details being used to respond to this enquiry. See the privacy notice.',
  errorSummaryHeading: 'There are some things to fix',
  serverErrorMessage:
    'That did not send. Check your connection and try again, or email me directly.',
  fields: {
    name: { label: 'Name' },
    email: { label: 'Work email' },
    company: { label: 'Company' },
    message: { label: 'What do you need help with?' },
    timeline: { label: 'Timeline' },
    consent: { label: 'Consent' },
  },
  timelineOptions: [
    { value: 'immediate', label: 'Immediately' },
    { value: 'month', label: 'Within a month' },
    { value: 'quarter', label: 'This quarter' },
    { value: 'exploring', label: 'Exploring options' },
  ],
} as const

export const THANKS = {
  h1: 'Enquiry received.',
  body: 'I will reply within two working days, usually sooner. If it is urgent, connect on LinkedIn and say so.',
} as const

export const FOOTER = {
  contactHeading: 'CONTACT',
  socialHeading: 'ELSEWHERE',
  legalHeading: 'LEGAL',
  legalLinkLabel: 'Privacy notice',
  markdownLinkLabel: 'This page as markdown',
  lastUpdatedLabel: `Last updated ${SITE.lastUpdated}`,
  copyright: `© ${SITE.copyrightYear} ${SITE.name}`,
  /** FR-913: visible text labels, never icon-only. */
  social: [
    { testid: 'link-linkedin', label: 'LinkedIn', href: SITE.linkedin },
    { testid: 'link-x', label: `X (${SITE.xHandle})`, href: SITE.x },
  ],
} as const

/** SEO-08: knowsAbout array on the Person block. */
export const KNOWS_ABOUT = [
  'Enterprise architecture',
  'Process automation',
  'Technical programme delivery',
  'Systems integration',
  'Digital transformation',
  'Target operating models',
] as const

/** Headings for the eleven sections, used for aria-labelledby (FR-004). */
export const SECTION_HEADINGS: Record<SectionId, string> = {
  hero: HERO.h1,
  proof: 'Track record',
  collapse: COLLAPSE.h2,
  services: SERVICES.h2,
  engage: ENGAGE.h2,
  work: WORK.h2,
  toolkit: TOOLKIT.h2,
  about: ABOUT.h2,
  availability: AVAILABILITY.h2,
  faq: FAQ.h2,
  contact: CONTACT.h2,
}

// ---------------------------------------------------------------------------
// SEO-08: four JSON-LD blocks, all generated from the objects above so the
// structured data cannot drift from the rendered page. FR-805 depends on this
// for the FAQ in particular: the answers below ARE the rendered answers.
// ---------------------------------------------------------------------------

const PERSON_ID = `${SITE.url}/#person`

export function jsonLdBlocks(): Array<Record<string, unknown>> {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    jobTitle: SITE.role,
    email: `mailto:${SITE.email}`,
    url: SITE.url,
    image: `${SITE.url}/images/aamir-butt-profile.jpg`,
    sameAs: [SITE.linkedin, SITE.x],
    knowsAbout: [...KNOWS_ABOUT],
    address: { '@type': 'PostalAddress', addressCountry: 'GB' },
  }

  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE.url}/#profilepage`,
    url: SITE.url,
    name: META.title,
    description: META.description,
    mainEntity: person,
  }

  const services = SERVICES.tracks.map((track) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: track.heading,
    description: track.description,
    areaServed: 'GB',
    provider: { '@id': PERSON_ID },
  }))

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return [person, profilePage, ...services, faqPage]
}
