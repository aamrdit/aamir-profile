# BUILD SPEC AND AGENT PROMPT
## Personal landing page: Aamir Butt, Automation and Enterprise Architecture Contractor

> **Status.** This is the authoritative spec. Where the implementation departs
> from it, `DECISIONS.md` records the departure and why. Read `DECISIONS.md`
> alongside this file — several requirements below have been amended (notably
> FR-105, FR-106, the Section 10 registry, FR-302 and the Section 6 mono type
> scale) and a number of internal conflicts have been resolved there.

---

## 0. AGENT INSTRUCTIONS: READ FIRST

You are a senior frontend engineer building a single page marketing site. You have full authority over implementation detail and no authority over scope, copy, colour, typography or the numbered requirements below. Where this spec is explicit, follow it exactly. Where it is silent, choose the simplest option that satisfies Section 3 (Hard Constraints) and note the choice in `DECISIONS.md`.

**Working protocol, non negotiable:**

1. Work milestone by milestone (M0 to M8, Section 15). Do not start a milestone before the previous one's acceptance criteria pass.
2. After each milestone, run `pnpm verify` (defined in M0) and report pass or fail per criterion. Do not self assess as "done" without running the commands.
3. Never invent factual content. All facts are placeholders in Section 5 and MUST render as visible `TODO` markers until replaced. A build check fails if any placeholder survives into a production build.
4. Never install a package not listed in Section 4 without asking first. No animation libraries, no UI component libraries, no icon packages.
5. Commit at the end of each milestone with the message `M<n>: <milestone name>`.
6. Keep a running `DECISIONS.md` listing every choice you made that this spec did not dictate, one line each.
7. If a requirement here conflicts with another requirement here, stop and ask. Do not pick one silently.

**Definition of a finished milestone:** code committed, `pnpm verify` green, acceptance criteria demonstrated by test output rather than by assertion in prose.

---

## 1. Locked project parameters

These are decided. Do not revisit them.

| Parameter | Value |
|---|---|
| Display name | `Aamir Butt` (double a, used everywhere including `<title>`, H1, JSON-LD, Open Graph) |
| Domain | `aamirbutt.com`, apex canonical, `www` redirects 301 to apex |
| Email | `aamir.butt@outlook.com` |
| LinkedIn | `https://www.linkedin.com/in/amir-butt-741a9937/` (note: the slug uses a single a, this is correct and MUST NOT be "fixed") |
| X | `https://x.com/aamirbutt`, handle `@aamirbutt` |
| Rate disclosure | "On request", with benchmarking basis stated. No number published |
| Locale | `en-GB`, British English spelling, GBP, DD/MM/YYYY dates |
| Routes | `/`, `/thanks`, `/legal` |
| Machine assets | `/llms.txt`, `/aamir-butt.md`, `/robots.txt`, `/sitemap.xml` |
| Host | Vercel, static prerender, production on `main` |

---

## 2. Mission and success criteria

The page converts a hiring manager or recruiter into a contract enquiry within 90 seconds. It is not a portfolio, blog or CV replica.

The build succeeds when all of the following are true simultaneously:

- Lighthouse mobile: Performance at least 95, Accessibility 100, Best Practices 100, SEO 100
- Zero `axe-core` violations at `wcag22aa` across five page states
- Zero horizontal overflow from 320px upward
- Nine Playwright specs green on five device projects
- Total gzipped JavaScript under 120KB, initial page weight under 900KB
- The page is fully readable and all content present with JavaScript disabled

---

## 3. Hard constraints

These override convenience at every decision point.

**Performance budgets (CI gates, pass or fail):**

| Metric | Budget |
|---|---|
| LCP mobile / desktop | under 2.0s / under 1.2s |
| INP | under 200ms |
| CLS | under 0.05 |
| TTFB | under 200ms |
| JS gzipped | under 120KB |
| Initial page weight | under 900KB |
| Font files | 3 maximum, woff2 only, Latin subset |
| Third party requests | 2 maximum (analytics, Turnstile) |

**Accessibility target:** WCAG 2.2 Level AA. Not 2.1.

**Rendering:** every route statically prerendered at build time. No route renders on demand. All text content present in the server rendered HTML. Nothing appears only after hydration.

**Banned outright:**
- `box-shadow` anywhere on the page
- Border radius above 2px
- Any CSS gradient
- Autoplaying video or audio
- Modals, exit intent popups, chat widgets, cookie banners, sticky mobile CTA bars, carousels
- `div` or `span` with a click handler in place of `<a>` or `<button>`
- `outline: none` without a `:focus-visible` replacement
- Scroll event listeners for reveal animations (use `IntersectionObserver`)
- Icon fonts, third party logo images, stock photography
- Storing form submissions in any database
- Google Analytics or any cookie setting analytics
- CSS class selectors in Playwright tests

---

## 4. Technology stack

Install exactly this. Nothing else without asking.

```
Framework      Nuxt 4 (Vue 3), TypeScript strict mode
Styling        Tailwind CSS 4 (@theme tokens, no arbitrary hex in templates)
Package mgr    pnpm (lockfile committed)
Runtime        Node.js 22 LTS (pinned in package.json engines and Vercel settings)
Images         @nuxt/image
Fonts          @nuxt/fonts, self hosted woff2
SEO            @nuxtjs/seo (sitemap, robots, schema.org)
Validation     zod (shared schema, client and server)
Email          resend
Spam           Cloudflare Turnstile (@nuxtjs/turnstile) + server side honeypot
Unit tests     vitest, @vue/test-utils
E2E tests      @playwright/test
A11y tests     @axe-core/playwright
Perf CI        @lhci/cli
Lint / format  eslint (@nuxt/eslint), prettier
Analytics      @vercel/analytics, @vercel/speed-insights, plus Plausible via script tag
Icons          inline SVG only, hand written
```

`pnpm verify` MUST be defined in `package.json` as:
```
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:e2e && pnpm test:lhci
```

---

## 5. Content variables: placeholders the human must fill

Create `content/site.ts` exporting a single typed config object. Every value below is a placeholder. Render each one in the UI as its literal `TODO` string so it is impossible to miss.

```ts
export const PLACEHOLDERS = {
  YEARS_EXPERIENCE:   'TODO_YEARS',        // e.g. '20+'
  PROOF_1_VALUE:      'TODO_PROOF_1',      // suggested: '20+ yrs'
  PROOF_1_LABEL:      'ENTERPRISE IT',
  PROOF_2_VALUE:      'TODO_PROOF_2',      // suggested: '40+'
  PROOF_2_LABEL:      'SYSTEMS INTEGRATED',
  PROOF_3_VALUE:      'TODO_PROOF_3',      // suggested: 'GBP 10m+'
  PROOF_3_LABEL:      'PROGRAMME VALUE DELIVERED',
  PROOF_4_VALUE:      'TODO_PROOF_4',      // suggested: '6'
  PROOF_4_LABEL:      'SECTORS',
  AVAILABLE_FROM:     'TODO_DATE',         // DD/MM/YYYY
  NOTICE_PERIOD:      'TODO_NOTICE',       // e.g. '2 weeks'
  CASE_01:            'TODO_CASE_01',
  CASE_02:            'TODO_CASE_02',
  CASE_03:            'TODO_CASE_03',
}
```

**Build guard, FR-901:** a Node script `scripts/check-placeholders.mjs` scans the built `.output/public` directory for the string `TODO_`. It exits 1 if any match is found AND `process.env.VERCEL_ENV === 'production'`. It exits 0 on preview and local builds. Wire it into the build as a post step. This lets the site deploy to preview with visible gaps and blocks a production launch with fake or missing facts.

**Case note format, mandatory.** Each of the three case notes uses exactly four labelled parts: `Context`, `Problem`, `What I did`, `Outcome`. One to two sentences each. The outcome contains at least one number. No client, employer or organisation may be named. Write at the level of "a global hospitality and membership group operating 40+ sites." No commercial terms, no internal figures, no personal data.

---

## 6. Design tokens

Define these in `assets/css/main.css` inside Tailwind 4's `@theme` block. Every colour and size used in a template MUST reference a token. Arbitrary hex values in templates fail code review.

```css
@theme {
  /* Colour: five values plus one text-safe accent variant */
  --color-ink:        #16150F;  /* body text, dark bands, primary buttons */
  --color-paper:      #E9E8E3;  /* page background */
  --color-paper-alt:  #DEDCD5;  /* alternating sections, cards */
  --color-rule:       #B4B1A8;  /* 1px rules, borders, dividers */
  --color-brass:      #A8843F;  /* accent: status dot, residue rules, focus ring */
  --color-brass-text: #7A5F26;  /* the ONLY brass permitted for text */

  /* Type */
  --font-primary: 'Switzer', ui-sans-serif, system-ui, sans-serif;
  --font-mono:    'Martian Mono', ui-monospace, monospace;

  /* Spacing: multiples of three throughout */
  --spacing-3: 3px;    --spacing-6: 6px;    --spacing-12: 12px;
  --spacing-18: 18px;  --spacing-24: 24px;  --spacing-36: 36px;
  --spacing-48: 48px;  --spacing-72: 72px;  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --content-max: 1440px;
  --nav-height-desktop: 64px;
  --nav-height-mobile: 56px;
  --radius-max: 2px;
}
```

**Colour rules, enforced:**
- `--color-brass` MUST NOT be used for text. It measures roughly 3.2:1 on `--color-paper` and fails AA. Use `--color-brass-text` (approximately 5.5:1).
- Brass MUST NOT exceed roughly 5% of any viewport's pixel area. It marks state changes only.
- `--color-ink` on `--color-paper` measures approximately 15.5:1. This is the default text pairing.

**Typography.** Two families, three files total. No serif anywhere on the page. This is deliberate.

| Role | Family | Weights | Usage |
|---|---|---|---|
| Primary | Switzer (Fontshare) | 400, 500 | H1 to H3, body, buttons |
| Utility | Martian Mono (Google Fonts) | 400 | Eyebrows, labels, step numbers, metadata, wordmark |

Self host as woff2, subset to Latin, `font-display: swap`, and preload only the two faces used above the fold.

**Type scale, implemented with `clamp()`:**

| Element | Size | Line height | Tracking |
|---|---|---|---|
| H1 | `clamp(2.75rem, 6vw, 5.5rem)` | 0.98 | -0.03em |
| H2 | `clamp(2rem, 3.5vw, 3rem)` | 1.05 | -0.02em |
| H3 | `1.375rem` | 1.2 | -0.01em |
| Body | `clamp(1.0625rem, 1.2vw, 1.25rem)` | 1.6 | 0 |
| Mono label | `clamp(0.6875rem, 0.8vw, 0.75rem)` | 1.3 | 0.14em, uppercase |

**Layout.** 12 column grid, content capped at `--content-max` and centred. Gutters 96px desktop, 48px at `md`, 24px at `sm`. Section vertical padding 144px desktop, 72px mobile. Depth comes from 1px rules and background steps only.

**Motion.** One orchestrated moment (`#collapse`) plus micro interactions. Hero load: staggered 400ms upward fade of eyebrow, H1, standfirst, CTA at 80ms intervals. Hover transitions 150ms. Every animation wrapped in a `prefers-reduced-motion: reduce` guard that removes it entirely.

---

## 7. Repository structure

Create exactly this tree.

```
.
├── CLAUDE.md                     # this spec
├── DECISIONS.md                  # your running log
├── nuxt.config.ts
├── vercel.json                   # security headers, redirects
├── tsconfig.json                 # strict: true
├── package.json                  # engines.node: "22.x"
├── playwright.config.ts
├── vitest.config.ts
├── lighthouserc.json
├── .env.example                  # RESEND_API_KEY, TURNSTILE_SECRET, NUXT_PUBLIC_TURNSTILE_SITE_KEY
├── assets/
│   ├── css/main.css              # @theme tokens, base layer, utilities
│   └── fonts/                    # switzer-400.woff2, switzer-500.woff2, martian-mono-400.woff2
├── content/
│   └── site.ts                   # ALL copy and config, single source of truth
├── components/
│   ├── layout/
│   │   ├── SiteNav.vue
│   │   ├── SiteFooter.vue
│   │   └── SkipLink.vue
│   ├── sections/
│   │   ├── HeroSection.vue
│   │   ├── ProofStrip.vue
│   │   ├── CollapseSection.vue      # the signature element
│   │   ├── ServicesSection.vue
│   │   ├── EngageSection.vue
│   │   ├── WorkSection.vue
│   │   ├── ToolkitSection.vue
│   │   ├── AboutSection.vue
│   │   ├── AvailabilitySection.vue
│   │   ├── FaqSection.vue
│   │   └── ContactSection.vue
│   └── ui/
│       ├── CtaButton.vue
│       ├── CtaLink.vue
│       ├── EyebrowLabel.vue
│       ├── SectionShell.vue         # handles id, aria-labelledby, padding, bg
│       └── EnquiryForm.vue
├── composables/
│   ├── useAnalytics.ts              # typed event emitter, Section 13
│   ├── useReveal.ts                 # IntersectionObserver wrapper
│   └── useReducedMotion.ts
├── pages/
│   ├── index.vue
│   ├── thanks.vue
│   └── legal.vue
├── public/
│   ├── images/aamir-butt-profile.jpg   # 512x512, supplied
│   ├── images/og.jpg                   # 1200x630, TODO asset
│   ├── favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
│   ├── llms.txt
│   └── aamir-butt.md
├── schemas/
│   └── enquiry.ts                   # zod schema, shared client and server
├── server/
│   └── api/enquiry.post.ts
├── scripts/
│   └── check-placeholders.mjs
└── tests/
    ├── unit/
    └── e2e/                         # 01 to 09, Section 14
```

**Asset note:** the supplied portrait is 512 x 512px RGB JPEG, 70KB. It is the only photograph available. Do not upscale it. Maximum display box is 240 CSS px. Do not generate, source or substitute any other photograph.

---

## 8. Functional requirements

### FR-000 series: global

- **FR-001** Single page at `/` containing twelve blocks with these exact IDs, in this order: `nav`, `hero`, `proof`, `collapse`, `services`, `engage`, `work`, `toolkit`, `about`, `availability`, `faq`, `contact`, `footer`. These IDs are the anchor targets, analytics keys and test selectors. They MUST NOT be renamed.
- **FR-002** `<html lang="en-GB">`.
- **FR-003** Exactly one `<h1>` on the page. Heading levels descend without skipping.
- **FR-004** Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. Every section is a `<section>` with `aria-labelledby` pointing at its own heading ID.
- **FR-005** A skip link is the first focusable element in the DOM, visually hidden until focused, and moves focus into `<main>`.
- **FR-006** `scroll-behavior: smooth` with `scroll-padding-top: 80px`, both disabled under `prefers-reduced-motion: reduce`.
- **FR-007** Focus indicator on every focusable element: 2px `--color-brass` outline, 2px offset, via `:focus-visible`.
- **FR-008** All interactive targets at least 44 x 44px on touch viewports, at least 24 x 24px everywhere.
- **FR-009** Every route statically prerendered. Verify by inspecting `.output/public` for the generated HTML files.
- **FR-010** Page fully functional with JavaScript disabled: all text present, all links working, `#collapse` in its end state, form degraded to a visible `mailto:` fallback.

### FR-100: nav

- **FR-101** Fixed to top. 64px desktop, 56px mobile. Background transparent over the hero.
- **FR-102** After 80px of scroll, background becomes solid `--color-paper` with a 1px `--color-rule` bottom border. Transition 180ms. Reverts on return to top.
- **FR-103** Left: text wordmark `AAMIR BUTT` in `--font-mono`, uppercase, 12px, 0.14em tracking. Not an image. Links to `#hero`.
- **FR-104** Centre: empty.
- **FR-105** Right, at `lg` and above: text links `Work` (to `#work`), `Availability` (to `#availability`), `Contact` (to `#contact`). *(Amended: the primary CTA button was removed — see DECISIONS.md D5.)*
- **FR-106** Below 1024px: a text trigger reading `Menu` (the word, not a hamburger icon) which opens a full screen overlay containing all anchors. *(Amended: the primary CTA was removed — see DECISIONS.md D5.)*
- **FR-107** The overlay closes on `Escape`, closes on anchor selection, traps focus while open, and returns focus to the `Menu` trigger on close.
- **FR-108** Every `href^="#"` on the page MUST resolve to an element that exists.

### FR-200: hero

- **FR-201** Minimum height `100svh` (small viewport height, which avoids the mobile browser chrome resize jump), capped at 900px.
- **FR-202** Desktop layout: 12 column grid split 7 / 5. Type left, portrait panel right. Stacks to type then portrait below 768px.
- **FR-203** Eyebrow: an 8px `--color-brass` dot followed by `AVAILABLE FOR CONTRACT · UK & REMOTE` in `--font-mono`.
- **FR-204** H1 across three lines with author controlled breaks, not accidental wrapping. Use `<br>` at `lg` and above, natural wrapping below.
- **FR-205** Standfirst paragraph constrained to a maximum measure of 46 characters.
- **FR-206** Primary CTA `Start a conversation` (scrolls to `#contact`) plus secondary link `See how I work` (scrolls to `#engage`).
- **FR-207** Micro credibility line beneath the CTAs in `--font-mono`, 12px.
- **FR-208** Portrait: 240 x 240 CSS px, zero radius, sitting on a `--color-paper-alt` panel with a 1px `--color-rule` border, offset to overlap the panel edge by 24px. Mono caption beneath: `AAMIR BUTT · LONDON & REMOTE`. At `sm` the portrait is 160px.
- **FR-209** Hero image `loading="eager"` and `fetchpriority="high"`. It is the LCP element.
- **FR-210** A `SCROLL` label with a 1px vertical rule whose height animates on load. Hidden below 768px. Removed entirely under reduced motion.

### FR-300: proof strip

- **FR-301** Full bleed band, `--color-ink` background, `--color-paper` text, 96px tall desktop.
- **FR-302** Four cells separated by 1px vertical rules at 15% opacity. Each cell: value in `--font-primary` at 32px, label beneath in `--font-mono` at 12px uppercase. *(Amended from 11px — see DECISIONS.md D6.)*
- **FR-303** Values and labels come from `PLACEHOLDERS`. Never hardcode a number in a template.
- **FR-304** Below 768px this becomes a 2 x 2 grid. It MUST NOT become a horizontal scroller.

### FR-400: collapse (the signature element)

This is the one memorable moment on the page. Build it carefully.

- **FR-401** Renders a real, named process: supplier onboarding and purchase order approval, as nine sequential steps numbered `01` to `09` in `--font-mono`. Numbering is used because the content genuinely is a sequence.
- **FR-402** Default server rendered state is the **three card end state**, not the nine card start state. The nine card state is applied by client script on mount only when motion is permitted. This guarantees FR-010 and reduced motion support with no extra code path.
- **FR-403** When the section reaches 40% visibility, six cards are removed and the remainder merge into three larger cards labelled `01 DESIGN`, `02 AUTOMATE`, `03 GOVERN`. Each retains a small footnote naming the original steps it absorbed.
- **FR-404** The six removed cards MUST NOT fade to nothing. They shrink to 1px `--color-brass` rules stacked along the left edge, so removed work persists as visible residue. **This detail is the point of the section. Do not simplify it away.**
- **FR-405** Transition duration 900ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 60ms per card.
- **FR-406** Uses `IntersectionObserver`. A scroll event listener is a build failure.
- **FR-407** Fires once. It MUST NOT re trigger on scrolling back up.
- **FR-408** Under `prefers-reduced-motion: reduce`: the three card state renders immediately with zero transition, plus a static caption stating what was removed. No information is lost.
- **FR-409** At `sm`: three cards stacked vertically, residue rules along the left, single stagger, no horizontal movement.
- **FR-410** Total added JavaScript for this section under 4KB gzipped.

### FR-500: services

- **FR-501** Three cards. Three columns at `lg`, two plus one full width at `md`, stacked at `sm`.
- **FR-502** Each card: mono eyebrow (`TRACK 01` to `TRACK 03`), H3, two sentence description, four item bulleted deliverables list.
- **FR-503** `--color-paper` cards on a `--color-paper-alt` section, 1px `--color-rule` border, no shadow, radius 0 to 2px.

### FR-600: engage

- **FR-601** Three engagement models as rows, each with name, shape, typical outcome, and an inline secondary CTA link.
- **FR-602** A reserved 16:9 video container at the foot of the section, `aspect-ratio: 16 / 9`, max width 880px, centred, 1px `--color-rule` border, radius 0. In v1 it renders a designed placeholder block, never an empty gap and never a broken `<video>`. The aspect ratio is present in CSS from v1 so adding video later causes zero layout shift.

### FR-700: work

- **FR-701** Three case notes as a stacked list separated by 1px rules. No cards.
- **FR-702** Each note: a mono index (`CASE 01`) in a narrow left column, content in a wide right column, with sector and duration as small mono metadata.
- **FR-703** Content follows the mandatory four part format in Section 5 and comes from `PLACEHOLDERS`.
- **FR-704** No organisation is named anywhere in this section. This is a hard compliance requirement, not a style preference.

### FR-800: toolkit, about, availability, faq

- **FR-801** Toolkit: four grouped text lists with mono headings (`ARCHITECTURE`, `AUTOMATION AND AI`, `DELIVERY`, `PLATFORM`). 4 up at `lg`, 2 x 2 at `md`, stacked at `sm`. No third party logos. No invented certifications.
- **FR-802** About: 5 / 7 column split with the portrait on the **left** to break the hero's rhythm. Portrait 180 x 180 CSS px, same square treatment, no caption. Three first person paragraphs plus a pull quote at 28px with a `--color-brass` opening rule. One line linking to LinkedIn.
- **FR-803** Availability: full width `--color-paper-alt` band containing a box with a 1px `--color-ink` border. Four rows, mono labels left, values right: `STATUS`, `ENGAGEMENT`, `RATE`, `NOTICE`. Primary CTA repeats here.
- **FR-804** FAQ: eight items using native `<details>` and `<summary>`. No JavaScript accordion, no custom ARIA widget. The first item is open by default via the `open` attribute.
- **FR-805** FAQ answer text MUST be identical, word for word, to the `FAQPage` JSON-LD. Generate both from the same object in `content/site.ts`.

### FR-900: contact, form, footer

- **FR-901** Placeholder build guard as specified in Section 5.
- **FR-902** Contact section is two columns: left has the H2, one sentence, and a real `mailto:` link; right has the form.
- **FR-903** The `mailto:` href MUST be exactly `mailto:aamir.butt@outlook.com?subject=Contract%20enquiry%20via%20website`.
- **FR-904** Form fields, all with visible persistent `<label>` elements. Placeholder only labelling is a build failure.

| Field | Name | Type | Required | Validation |
|---|---|---|---|---|
| Name | `name` | text | yes | 2 to 80 chars |
| Work email | `email` | email | yes | RFC pattern, revalidated server side |
| Company | `company` | text | no | max 120 chars |
| What do you need help with? | `message` | textarea | yes | 20 to 2000 chars, live character counter |
| Timeline | `timeline` | select | yes | one of `immediate`, `month`, `quarter`, `exploring` |
| Consent | `consent` | checkbox | yes | must be `true`, label links to `/legal` |
| Honeypot | `website` | text | no | MUST be empty; visually hidden, `tabindex="-1"`, `aria-hidden="true"` |

- **FR-905** Validation uses one shared zod schema in `schemas/enquiry.ts`, imported by both the component and the server route. No duplicated rules.
- **FR-906** Submit button label `Send enquiry`. On submit it becomes `Sending`, disabled, with `aria-busy="true"`. Success navigates to `/thanks`.
- **FR-907** Errors render inline beneath each field, associated via `aria-describedby`, plus a summary block above the form that receives focus on failed submit. Error copy states what to fix. It never apologises and never says "invalid input".
- **FR-908** Double submit protection: rapid repeat presses fire exactly one network request.
- **FR-909** A failed request keeps the user's input intact and shows a visible error without navigating away.
- **FR-910** Turnstile token verified server side. Missing or invalid token returns 400.
- **FR-911** `server/api/enquiry.post.ts` forwards by email via Resend to `aamir.butt@outlook.com` and stores nothing. It MUST NOT log IP addresses or user agents.
- **FR-912** Footer: `--color-ink` background, three columns collapsing to one at `sm`. Contact block, social links with visible text labels (not icon only), legal block containing the `/legal` link, a `Last updated DD/MM/YYYY` line and the copyright.
- **FR-913** All external links carry `target="_blank"` and `rel="noopener noreferrer"` and have an accessible name that is not merely "link".
- **FR-914** `/legal` contains a privacy notice stating what is collected, the lawful basis (legitimate interest in responding to a business enquiry), the retention period, and how to request deletion. It is linked from the consent checkbox label.
- **FR-915** `/thanks` contains an H1 `Enquiry received.` and is prerendered.

---

## 9. Copy deck

All copy lives in `content/site.ts`. Never inline a string in a template. Copy rules: sentence case headings, no exclamation marks, no rhetorical questions outside the FAQ, body measure maximum 46 characters.

**hero**
- eyebrow: `AVAILABLE FOR CONTRACT · UK & REMOTE`
- h1: `Automation that survives contact with your organisation.`
- standfirst: `Twenty years of enterprise architecture and technical delivery, now pointed at the harder half of automation: deciding what to automate, designing it so it holds, and getting it live.`
- ctaPrimary: `Start a conversation`
- ctaSecondary: `See how I work`
- micro: `ENTERPRISE ARCHITECTURE · TRANSFORMATION · TECHNICAL PROGRAMME DELIVERY`

**collapse**
- eyebrow: `THE WORK`
- h2: `Most automation projects fail at step four.`
- body: `Here is a supplier onboarding process as it usually exists. Nine steps, four handoffs, two spreadsheets and one person who knows how it really works. Automating it step for step just makes the wrong process faster. Redesigning it first is the difference between a pilot and a change.`
- caption: `Six steps removed, not automated. That is usually where the value is.`

**services**
- eyebrow: `WHAT I DO`
- h2: `Three tracks, one discipline.`
- body: `Whether the engagement is labelled architecture, transformation or automation, the work is the same: understand the estate, decide what should change, and make the change stick.`

| Track | Eyebrow | Heading | Deliverables |
|---|---|---|---|
| 1 | `TRACK 01` | Automation design and delivery | Process discovery and prioritisation; automation architecture; build oversight; live handover |
| 2 | `TRACK 02` | Enterprise architecture and transformation | Current and target state models; integration strategy; technology roadmap; governance model |
| 3 | `TRACK 03` | Technical programme delivery | Delivery planning; vendor and supplier management; risk and dependency control; go live |

**engage**
- eyebrow: `HOW WE WORK TOGETHER`
- h2: `Three ways in.`
- body: `Short and scoped, embedded and accountable, or on hand when you need a senior second opinion.`

| Model | Shape | Typical outcome |
|---|---|---|
| Automation discovery sprint | 2 to 3 weeks, fixed scope | A ranked automation backlog with effort, dependency and value estimates |
| Embedded contract | 3 to 12 months, day rate | Architecture ownership or delivery ownership on a live programme |
| Architecture advisory | Retained, small monthly commitment | Design review, assurance, and a senior second opinion on the record |

**work**
- eyebrow: `EVIDENCE`
- h2: `Selected engagements.`
- body: `Client names withheld. Happy to talk specifics under NDA.`

**toolkit**
- eyebrow: `CAPABILITY`
- h2: `What I bring to the estate.`
- ARCHITECTURE: TOGAF style modelling; integration patterns; API strategy; data flow design; target operating models
- AUTOMATION AND AI: workflow automation; LLM assisted process design; agentic tooling; evaluation and guardrails; human in the loop design
- DELIVERY: Agile and hybrid delivery; programme governance; vendor management; migration and cutover
- PLATFORM: cloud platforms; identity and access; security and compliance; legacy integration

**about**
- eyebrow: `ABOUT`
- h2: `I have spent twenty years learning why good systems fail.`
- p1: `My background is enterprise architecture and technical programme delivery, which is a formal way of saying I have spent two decades in the space between what a business wants and what its systems will actually allow.`
- p2: `That is why automation interests me now. The tooling has finally caught up with the ambition, and the constraint has moved. The hard part is no longer whether something can be automated. It is whether the process deserves to exist in the first place, and whether the organisation around it can absorb the change.`
- p3: `I take on contract work where that judgement is the thing being hired, not just the delivery capacity.`
- pullQuote: `The technology was never the bottleneck.`

**availability**
- eyebrow: `COMMERCIALS`
- h2: `Availability and terms, up front.`
- body: `You are probably triaging several candidates. Here is everything you need to rule me in or out.`
- STATUS: `Available from {{AVAILABLE_FROM}}`
- ENGAGEMENT: `Contract, UK and remote. Outside IR35 preferred.`
- RATE: `Indicative day rate on request, benchmarked to UK market rates for senior automation and architecture roles.`
- NOTICE: `{{NOTICE_PERIOD}}`

**faq** (questions verbatim; answers to be written by Aamir, placeholder `TODO_FAQ_n` until then)
1. `Are you available for contract work right now?`
2. `Do you work inside or outside IR35?`
3. `What is your day rate?`
4. `Do you work remotely or on site?`
5. `What kind of automation work do you take on?`
6. `Are you a developer or an architect?`
7. `What size of organisation do you usually work with?`
8. `How do we start?`

**contact**
- eyebrow: `NEXT STEP`
- h2: `Tell me what you are trying to change.`
- body: `A short description of the problem is more useful to both of us than a job specification. I reply to everything within two working days.`
- emailLine: `Or email me directly at aamir.butt@outlook.com`
- submitLabel: `Send enquiry`
- consentLabel: `I agree to my details being used to respond to this enquiry. See the privacy notice.`

**thanks**
- h1: `Enquiry received.`
- body: `I will reply within two working days, usually sooner. If it is urgent, connect on LinkedIn and say so.`

---

## 10. `data-testid` registry

Implement every attribute below. Playwright tests reference these and accessible roles only. CSS class selectors in tests are a build failure.

| testid | Element |
|---|---|
| `skip-link` | Skip to content link |
| `nav` | Nav element |
| `nav-wordmark` | Wordmark link |
| `nav-link-work`, `nav-link-availability`, `nav-link-contact` | Nav anchors |
| `nav-menu-trigger` | Mobile `Menu` trigger |
| `nav-menu-overlay` | Mobile overlay |
| `cta-primary-hero`, `cta-primary-availability` | The two primary CTAs *(amended: `cta-primary-nav` removed, DECISIONS.md D5)* |
| `cta-secondary-hero` | Hero secondary link |
| `cta-engage-1`, `cta-engage-2`, `cta-engage-3` | Engage row links |
| `hero-image` | Hero portrait `<img>` |
| `about-image` | About portrait `<img>` |
| `proof-cell` | Each proof cell (4 instances) |
| `collapse-card` | Each merged card (3 after transition) |
| `collapse-step` | Each of the 9 initial steps |
| `collapse-residue` | Each residue rule (6 after transition) |
| `collapse-caption` | Reduced motion static caption |
| `service-card` | Each service card (3) |
| `case-note` | Each case note (3) |
| `faq-item`, `faq-summary` | FAQ `<details>` and `<summary>` |
| `availability-row` | Each availability row (4) |
| `enquiry-form` | Form element |
| `field-name`, `field-email`, `field-company`, `field-message`, `field-timeline`, `field-consent`, `field-honeypot` | Inputs |
| `error-name`, `error-email`, `error-message`, `error-timeline`, `error-consent` | Inline errors |
| `error-summary` | Error summary block |
| `submit-enquiry` | Submit button |
| `form-error-banner` | Server error message |
| `mailto-link` | Direct email link |
| `link-linkedin`, `link-x` | Social links |
| `video-slot` | Reserved 16:9 container |
| `footer` | Footer element |
| `last-updated` | Footer date line |

---

## 11. SEO and structured data

- **SEO-01** `<title>`: `Aamir Butt | Automation & Enterprise Architecture Contractor, UK` (under 60 characters).
- **SEO-02** Meta description, 150 to 158 characters, hand written, containing the phrase `available for contract`.
- **SEO-03** Canonical link on every route, pointing at the apex domain.
- **SEO-04** Complete Open Graph and Twitter card tags. `twitter:card` is `summary_large_image`, `twitter:site` is `@aamirbutt`. Image is `/images/og.jpg` at 1200 x 630. Never stretch the 512px portrait to fill the card; the OG image is a separate designed asset.
- **SEO-05** Favicon set at 32, 180, 192 and 512px. It is a mono `AB` wordmark on `--color-ink`, not the photograph. Photographs do not read at 32px.
- **SEO-06** Generated `robots.txt` and `sitemap.xml`.
- **SEO-07** `robots.txt` MUST explicitly allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` and `CCBot`. This is deliberate: discovery is the goal, so blocking AI crawlers works against it.
- **SEO-08** Four JSON-LD blocks, all valid and all generated from `content/site.ts`:
  1. `Person` with `name`, `jobTitle`, `email`, `url`, `image`, `sameAs` (LinkedIn and X), `knowsAbout` array, `address.addressCountry: "GB"`
  2. `ProfilePage` with the `Person` as `mainEntity`
  3. `Service` for each of the three tracks, `provider` referencing the `Person`, `areaServed: "GB"`
  4. `FAQPage` mirroring all eight FAQ items verbatim
- **SEO-09** `/llms.txt`: markdown covering who Aamir is, what he offers, availability and contact, plus links.
- **SEO-10** `/aamir-butt.md`: the full page content as clean markdown at a stable URL, linked from the footer with `rel="alternate"`.
- **SEO-11** Descriptive link text throughout. Zero instances of `click here` or `read more`.

---

## 12. Security headers

Set in `vercel.json`:

```
Content-Security-Policy         self, plus the analytics domain and Turnstile only
Strict-Transport-Security       max-age=63072000; includeSubDomains
X-Content-Type-Options          nosniff
Referrer-Policy                 strict-origin-when-cross-origin
Permissions-Policy              camera=(), microphone=(), geolocation=()
```

Caching: hashed static assets immutable for one year; HTML short revalidate.

---

## 13. Analytics contract

`composables/useAnalytics.ts` exposes one typed function. Event names are fixed and MUST be implemented exactly as written, because dashboards depend on them. Cookieless only. No consent banner.

```ts
type AnalyticsEvent =
  | { name: 'cta_primary_click';           props: { location: 'nav' | 'hero' | 'availability' } }
  | { name: 'cta_secondary_click';         props: { location: string; label: string } }
  | { name: 'email_link_click';            props: { location: string } }
  | { name: 'linkedin_click';              props: { location: string } }
  | { name: 'x_click';                     props: { location: string } }
  | { name: 'collapse_animation_viewed';   props: { reduced_motion: boolean } }
  | { name: 'section_viewed';              props: { section_id: string } }
  | { name: 'faq_expand';                  props: { question_index: number } }
  | { name: 'form_start';                  props: Record<string, never> }
  | { name: 'form_submit_attempt';         props: Record<string, never> }
  | { name: 'form_submit_success';         props: { timeline: string } }
  | { name: 'form_submit_error';           props: { error_type: string } }
  | { name: 'scroll_depth';                props: { depth: 25 | 50 | 75 | 100 } }
  | { name: 'pdf_download';                props: Record<string, never> }
```

`section_viewed` fires exactly once per section, at 50% visibility. The composable MUST be stubbable so tests can count calls.

---

## 14. Test specification

### Approach

**Test driven where it earns its place.** Write failing tests first for: the zod validation schema, the `/api/enquiry` handler, and any content transformation utility. Cover the edge cases explicitly: empty submit, malformed email, oversize payload, missing consent, failed Turnstile token, upstream email provider failure.

Do **not** write tests asserting padding values before the design exists. Layout and animation are covered by end to end tests and visual snapshots after the design settles.

### Playwright configuration

- Projects: `chromium-desktop` (1440x900), `firefox-desktop` (1440x900), `webkit-desktop` (1440x900), `mobile-chrome` (Pixel 7), `mobile-safari` (iPhone 14).
- Runs against the Vercel preview URL on every pull request, and as a smoke suite against production after deploy.
- Retries 2 in CI, 0 locally. Trace and video on first retry.
- `/api/enquiry` mocked via route interception in every spec except one dedicated integration test against a staging endpoint.
- Selectors: `data-testid` or accessible roles only.

### Required specs

**`01-page-load.spec.ts`**
- `/` returns 200
- `<title>` exactly matches SEO-01
- Exactly one non empty `<h1>`
- Meta description present, 120 to 160 characters
- Canonical present and matching the production origin
- All thirteen IDs from FR-001 exist in the DOM
- Zero console errors, zero failed network requests on load
- All four JSON-LD blocks parse as JSON and contain the expected `@type` values
- `/llms.txt`, `/aamir-butt.md`, `/robots.txt`, `/sitemap.xml`, `/legal`, `/thanks` all return 200
- Hero image reports non zero `naturalWidth`

**`02-responsive.spec.ts`**
- For each of 320, 375, 390, 768, 1024, 1440 and 1920px: `document.documentElement.scrollWidth` is not greater than the viewport width. **This is the single highest value test in the suite.**
- At 375px: `nav-menu-trigger` visible; overlay opens, contains all anchors, closes on `Escape`, traps focus while open
- At 1440px: three nav links visible; `nav-menu-trigger` absent
- `proof-cell` count is 4 at both widths; grid is 2 columns at 375px and 4 at 1440px
- `service-card` renders 1 column at 375px, 3 at 1440px
- No computed font size below 12px at any breakpoint
- Full page screenshot comparison at 375, 768 and 1440px, 0.2% pixel tolerance
- Page usable and readable at 200% browser zoom at 1280px

**`03-cta.spec.ts`**
- Both primary CTAs present, visible, with accessible names *(amended: two, not three — DECISIONS.md D5)*
- Each primary CTA at least 44px tall on mobile projects
- `cta-primary-hero` click scrolls `#contact` into view and `field-name` is focusable
- Assert zero `div[onclick]` or `span[onclick]` exist anywhere in the DOM
- Every CTA reachable by `Tab` and activated by `Enter`
- On focus, every CTA has a computed outline width greater than 0
- At no single scroll position is more than one primary CTA within the viewport

**`04-navigation.spec.ts`**
- Each nav anchor scrolls to its target and updates `location.hash`
- After anchor navigation the target heading's `boundingBox().y` is greater than the nav height, proving it is not obscured by the sticky nav (WCAG 2.2 SC 2.4.11)
- `skip-link` is the first focusable element, becomes visible on focus, moves focus into `<main>`
- Nav gains its solid background past 80px scroll and loses it at the top
- Every `a[href^="#"]` has a matching element ID

**`05-media.spec.ts`**
- Every `<img>` has a non null `alt`; empty `alt` permitted only alongside `aria-hidden="true"`
- Every `<img>` has explicit `width` and `height` attributes
- Every image completes loading with non zero `naturalWidth`
- `hero-image` has `fetchpriority="high"`; every below fold image has `loading="lazy"`
- Response `content-type` for images includes AVIF or WebP
- `video-slot` exists with a computed `aspect-ratio` of 16/9 and contains no `<video>` element in v1

**`06-contact.spec.ts`**
- `mailto-link` href exactly equals FR-903's string, including the encoded subject
- Empty submit shows errors on all required fields and fires zero network requests
- Each error is associated to its field via `aria-describedby`
- `error-summary` receives focus on failed submit
- Malformed email rejected client side
- Submit blocked when `field-consent` is unchecked
- Valid submit with mocked 200 navigates to `/thanks`, which contains the confirmation H1
- Mocked 500 shows `form-error-banner`, does not navigate, and retains all user input
- `field-honeypot` present, visually hidden, empty by default
- Two rapid submit presses fire exactly one network request

**`07-social.spec.ts`**
- `link-linkedin` href exactly equals `https://www.linkedin.com/in/amir-butt-741a9937/`
- `link-x` href resolves to the `@aamirbutt` profile
- Both have `target="_blank"` and `rel` containing both `noopener` and `noreferrer`
- Both have an accessible name that is not empty and not merely "link"
- A separate **nightly** job performs a real HTTP `HEAD` against both URLs and fails on a non 2xx or 3xx status, catching a dead profile link. Excluded from the pull request suite to avoid flakiness.

**`08-scroll-visibility.spec.ts`**
- Scrolling progressively through the page makes each of the eleven sections visible in DOM order *(amended from twelve — DECISIONS.md C1)*
- `collapse-step` count is 9 before the section enters view; after entering, `collapse-card` count is 3 and `collapse-residue` count is 6
- With `prefers-reduced-motion: reduce` emulated: 3 cards render immediately with zero transition and `collapse-caption` is present
- With JavaScript disabled: `collapse-card` count is 3, and all eleven sections contain their text content
- Reveal animations run once and do not re trigger on scrolling back up
- With `useAnalytics` stubbed, `section_viewed` fires exactly once per section

**`09-accessibility.spec.ts`**
- `@axe-core/playwright` full page scan against `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`. **Zero violations. Not "zero critical". Zero.**
- Repeat the scan with the mobile menu overlay open
- Repeat with all FAQ items expanded
- Repeat in the failed form validation state, which is where accessibility defects most often hide
- Exactly one `<h1>`, and no skipped heading levels, verified by walking all `h1` to `h6` in document order
- `<html lang="en-GB">`
- Every form input has an associated `<label>`
- Tab through the whole page: focus order matches DOM order, focus never becomes invisible, focus is never trapped outside a modal
- Computed contrast at least 4.5:1 on body and button text, at least 3:1 on large text
- Assert `--color-brass` is never used as a `color` value on any text node

### Unit tests

- `schemas/enquiry.ts`: 90% coverage minimum. Every boundary: 1 and 2 and 80 and 81 characters on name; 19 and 20 and 2000 and 2001 on message; each valid and one invalid `timeline` value; consent false and true.
- `server/api/enquiry.post.ts`: valid payload returns 200 and calls the mail client once; invalid payload returns 400 and calls it zero times; missing Turnstile token returns 400; non empty honeypot returns 200 without sending (silent discard, so bots learn nothing); mail provider throwing returns 500 with a generic message and no stack trace in the body; assert no IP or user agent appears in any log call.

### Lighthouse CI

`lighthouserc.json` asserts every budget in Section 3 as an error level assertion on the mobile preset, run against the preview URL.

---

## 15. Milestones

Execute in order. Do not start the next until the previous acceptance criteria pass by test output.

### M0: Scaffold and gates
Nuxt 4 + TypeScript strict + Tailwind 4 + pnpm. All config files from Section 7. `@theme` tokens from Section 6. Fonts self hosted and subset. `pnpm verify` script defined. GitHub Actions workflow running it. Empty Playwright and Vitest suites that execute successfully. `vercel.json` headers.
**Accept:** `pnpm verify` exits 0. `pnpm build` produces static HTML in `.output/public`. Tokens resolve in a scratch page. Three font files and no more.

### M1: Layout shell
`SiteNav`, `SiteFooter`, `SkipLink`, `SectionShell`, `CtaButton`, `CtaLink`, `EyebrowLabel`. Twelve empty sections with correct IDs, headings and `aria-labelledby`. `content/site.ts` fully populated from Section 9. All `data-testid` attributes from Section 10 present on the elements that exist.
**Accept:** `01-page-load`, `04-navigation` and `09-accessibility` pass. Zero axe violations on the empty shell.

### M2: Hero and proof
FR-200 and FR-300 complete, including the portrait panel treatment and the hero load stagger.
**Accept:** `02-responsive` and `05-media` pass. LCP under 2.0s on the mobile Lighthouse run. No horizontal overflow at 320px.

### M3: The signature section
FR-400 complete, including residue rules, reduced motion path and the no JavaScript end state.
**Accept:** `08-scroll-visibility` passes on all five projects. Section JavaScript under 4KB gzipped, demonstrated by bundle analysis. Zero scroll event listeners in the built output.

### M4: Content sections
FR-500 to FR-802 complete: services, engage (with the reserved video slot), work, toolkit, about.
**Accept:** `02-responsive` and `09-accessibility` pass. Placeholder guard reports every unfilled `TODO_` value.

### M5: Commercial sections
FR-803 to FR-805 complete: availability band and native FAQ accordion, with FAQ answers and JSON-LD generated from one source.
**Accept:** `09-accessibility` passes with all FAQ items expanded. `FAQPage` JSON-LD text matches rendered text exactly, asserted by a unit test.

### M6: Form and API
FR-901 to FR-915 complete: zod schema, form component with full error handling, Nitro route, Resend, Turnstile, honeypot, `/thanks`, `/legal`.
**Accept:** `06-contact` passes. Unit coverage on the schema and handler at 90%. A real submission arrives correctly formatted in Outlook, Gmail and Apple Mail, and not in spam.

### M7: SEO, analytics, machine assets
Section 11 and Section 13 complete, plus `/llms.txt`, `/aamir-butt.md`, favicon set, OG image slot.
**Accept:** `01-page-load` and `07-social` pass. All four JSON-LD blocks validate against the Rich Results Test. Lighthouse SEO 100.

### M8: Hardening and launch readiness
Full suite on five projects. Visual baselines committed. Lighthouse CI green against all budgets. Manual checklist in Section 16 completed and signed.
**Accept:** every criterion in Section 2 true simultaneously. `DECISIONS.md` complete.

---

## 16. Manual pre launch checklist

Not automatable. Must be completed and signed off by name and date before the production domain goes live.

1. Real iPhone (Safari) and real Android (Chrome), at default and largest system font sizes
2. **LinkedIn in app browser on both platforms.** This will be the largest single referrer and it behaves unlike Safari or Chrome
3. Enquiry email arrives correctly formatted in Outlook, Gmail and Apple Mail, not in spam
4. Every `mailto:` link opens with the subject prefilled
5. Both social links open the correct live profile
6. VoiceOver on Safari: full page traverse, form completion, accordion operation
7. NVDA on Firefox: same
8. Keyboard only: complete a form submission without touching a pointing device
9. JavaScript disabled: page readable, all content present, `#collapse` in end state, `mailto:` fallback visible
10. Slow 3G throttled: page usable within 5 seconds
11. Print stylesheet: prints to something a recruiter could hand over, with nav, CTAs and animation suppressed
12. Every factual claim verified by Aamir in writing
13. Broken link scan, internal and external
14. `/legal` privacy notice live and linked from the consent checkbox

---

## 17. Compliance guardrails

The agent MUST enforce these. They are not stylistic.

1. **No organisation may be named** on the page, in a case note, as a logo, or in any metadata. No employer, no client. All case notes stay at the level of "a global hospitality and membership group operating 40+ sites."
2. **No real personal data** other than Aamir's own published contact details. No member data, no employee data, no commercial terms, no internal figures. Any test fixture data MUST be obviously fictional.
3. **No form submissions stored.** Forward and discard. No database, no logging of IP or user agent.
4. **Cookieless analytics only**, so no consent banner is required.
5. **No third party typeface, logomark, image or copy** is copied from any brand. The visual direction is inspired by principles (monochrome restraint, type led layout, a grid built on multiples of three), not by borrowed assets. Do not download or reference the Faro typeface.
6. **No invented facts.** No fabricated certifications, client names, testimonials, star ratings, "as featured in" claims, or urgency devices such as countdowns or "only two slots left".
7. All generated content is a draft for human review, not approved copy. Do not describe any output as final or approved.

---

## 18. Anti pattern reference

If you find yourself about to do any of the following, stop. Each one has been considered and rejected.

| Tempting | Why not |
|---|---|
| Autoplaying hero video | 2 to 5MB, wrecks LCP, adds nothing to a claim carried by type and a face |
| Sticky mobile CTA bar | Eats 12% of a small viewport and covers the footer links on a page this short |
| Upscaling the 512px portrait into a full bleed hero | It will look soft and undercut the credibility the page exists to establish |
| A JavaScript accordion | Native `<details>` is keyboard accessible for free and crawlable |
| A UI component library | 12 static sections do not justify the bundle |
| Adding a serif display face | The no serif decision is deliberate. Seriousness comes from the grid and spacing |
| A cookie banner | Only needed because of analytics you were told not to install |
| Terracotta accent on cream background | The default generated landing page look. The brass on warm grey palette is the specified alternative |
| Client logo wall | Requires per organisation written permission and looks like a template |
| "Zero critical axe violations" | The bar is zero violations |

---

*End of spec. Derived from PRD v1.0 dated 31/07/2026. Locked defaults: name `Aamir Butt`, domain `aamirbutt.com`, rate on request. To change any of those, edit Section 1 only.*
