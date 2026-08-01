# Pre-launch checklist

Section 16 of `CLAUDE.md`. **Not automatable.** Every item must be completed and
signed off by name and date before the production domain goes live.

Nothing here can be ticked by the build. Where a related automated check exists,
it is named — but passing it is not a substitute for doing the manual check.

| # | Item | Automated cover | Done by | Date |
|---|---|---|---|---|
| 1 | Real iPhone (Safari) and real Android (Chrome), at default **and largest** system font sizes | `02-responsive` covers emulated viewports only | | |
| 2 | **LinkedIn in-app browser on both platforms** | none — see note below | | |
| 3 | Enquiry email arrives correctly formatted in Outlook, Gmail and Apple Mail, and not in spam | unit tests cover the payload, not delivery | | |
| 4 | Every `mailto:` link opens with the subject prefilled | `06-contact` asserts the href string only | | |
| 5 | Both social links open the correct live profile | `07-social` asserts the hrefs; nightly job checks they resolve | | |
| 6 | VoiceOver on Safari: full page traverse, form completion, accordion operation | `09-accessibility` is axe only | | |
| 7 | NVDA on Firefox: same | as above | | |
| 8 | Keyboard only: complete a form submission without a pointing device | `09-accessibility` tests focus order, not a full submission | | |
| 9 | JavaScript disabled: page readable, all content present, `#collapse` in end state, `mailto:` fallback visible | `08-scroll-visibility` covers this automatically | | |
| 10 | Slow 3G throttled: usable within 5 seconds | Lighthouse runs simulated mobile throttling | | |
| 11 | Print stylesheet produces something a recruiter could hand over | print CSS written, never visually verified | | |
| 12 | **Every factual claim verified by Aamir in writing** | placeholder guard blocks unfilled values only | | |
| 13 | Broken link scan, internal and external | `link-checker` covers internal links at lint time | | |
| 14 | `/legal` privacy notice live and linked from the consent checkbox | `06-contact` asserts the link exists | | |

## Notes on the items most likely to surprise

**Item 2 — the LinkedIn in-app browser.** This will be the largest single
referrer and it behaves unlike Safari or Chrome. It has its own user agent,
its own JavaScript quirks, and it has historically mishandled `svh` units and
`prefers-reduced-motion`. The hero uses `100svh` (FR-201) and the collapse
section keys off `prefers-reduced-motion` (FR-402), so both need looking at
there specifically.

**Item 3 — spam placement.** Resend needs `aamirbutt.com` verified with SPF,
DKIM and DMARC records before delivery can be trusted. Sending from
`enquiries@aamirbutt.com` without them will land in spam.

**Item 11 — print.** The stylesheet suppresses the nav, every CTA, the form and
the animation, forces the collapse section to its end state, expands all FAQ
answers, and appends the target of every external link. It has not been put in
front of a printer.

**Item 12 — factual claims.** This is the one that blocks launch. Every
`TODO_` value in `content/site.ts` is still unfilled; run `pnpm build` to list
them. A production build refuses to complete while any remain (FR-901).

## Still blocked on credentials

These cannot be signed off until the accounts exist. See `DECISIONS.md` D11.

- [ ] **Resend API key**, with `aamirbutt.com` verified for sending — blocks item 3
- [ ] **Cloudflare Turnstile** site key and secret — until then the form ships with honeypot-only spam protection
- [ ] **Vercel project and the `aamirbutt.com` domain** — blocks the Rich Results check and the production gate
- [ ] **Plausible site** (optional) — without it, analytics is Vercel-only
- [ ] **Confirm the X handle `@aamirbutt` exists** — the nightly link check will fail against a dead profile

## Sign-off

I confirm every item above has been completed, and that every factual claim on
the site is accurate.

Name: ____________________  Date: ____ / ____ / ________
