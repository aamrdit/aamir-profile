# DECISIONS

Every choice this build made that `CLAUDE.md` did not dictate, one line each,
per Section 0 rule 6. Newest milestone last.

Prefixes: **D** = decided with Aamir in planning. **C** = spec conflict resolved
on engineering grounds. **M0**–**M8** = implementation choice at that milestone.

---

## Agreed with Aamir before M0

- **D1** Built in place at `C:\Workspace\Aamir Profile`; the stub `package.json` became the Nuxt project's, `package-lock.json` was deleted and `node_modules` reinstalled by pnpm.
- **D2** Node **24** replaces Section 4's Node 22 pin: `engines.node: "24.x"`, Vercel Node.js Version 24.x. v24.15.0 is the installed runtime and the current LTS line.
- **D3** pnpm installed via `npm i -g pnpm@10`, **not** `corepack enable pnpm` — Corepack failed with `EPERM` writing shims into `C:\Program Files\nodejs`. Version pinned anyway by `packageManager: "pnpm@10.34.5"`.
- **D4** `@playwright/cli` retained as a devDependency although Section 4 does not list it, so the existing `.claude/skills/playwright-cli` skill keeps resolving.
- **D5** The nav primary CTA is **dropped entirely**. Amends FR-105 and FR-106, removes `cta-primary-nav` from the Section 10 registry, and reduces `03-cta` to two primary CTAs. Resolves the contradiction with `03-cta`'s "no more than one primary CTA in the viewport", which a fixed nav CTA cannot satisfy.
- **D6** Mono label floor raised from the spec's `0.6875rem` (11px) to `0.75rem` (12px), and FR-302 proof labels from 11px to 12px, so `02-responsive`'s "no computed font size below 12px" holds.
- **D7** Fonts self-hosted without a subsetting step: Martian Mono 400 taken pre-subset from Google's latin file, Switzer 400/500 as Fontshare serves them. **Deviation from Section 6's "subset to Latin"** for Switzer. Costs less than feared — the three files total 46,644 bytes.
- **D8** Body measure: 46ch on the hero standfirst and section intros per FR-205, and 64ch (`measure-prose`) on long-form prose — About paragraphs, case notes, FAQ answers. Section 9's blanket "maximum 46 characters" would halve a conventional reading measure.
- **D9** Lighthouse assertions staged: resource budgets at error level from M0; the four category scores sit at `warn` until M2, when they flip to `error`. An empty M0 scaffold cannot score Accessibility 100 or SEO 100, so `pnpm verify` could not otherwise go green at M0.
- **D10** `Profile.pdf` in the sibling `C:\Workspace\Aamir-Profile` was **not** read. Every Section 5 fact stays a visible `TODO_` marker for Aamir to fill.
- **D11** Resend, Turnstile and Plausible are env-gated and stubbed; no keys were supplied. The suite stays green without them.

## Spec conflicts resolved on engineering grounds

- **C1** FR-001 says "twelve blocks" then lists thirteen IDs, and `08` says "twelve sections". Resolved as **13 anchor IDs**, of which **11 are `<section>` elements** (`hero`…`contact`), plus `nav` and `footer`. Section 7's component tree confirms 11.
- **C2** M3 forbids scroll event listeners, but FR-102 and `scroll_depth` both need scroll position. Both use `IntersectionObserver` sentinels instead — an 80px sentinel at the top of `#hero` for the nav, four at document-height fractions for depth. Enforced by `scripts/check-bans.mjs`.
- **C3** `section_viewed` at 50% visibility can never fire for a section taller than twice the viewport, which several are at 375px. Resolved with a dual-condition observer: `intersectionRatio >= 0.5` **or** the intersection covering ≥50% of viewport height.
- **C4** FR-402's mount-time swap from 3 cards to 9 would flash and breach CLS < 0.05. Both states live in the DOM; a pre-paint inline script sets `data-motion` on `<html>` and CSS chooses. Still satisfies FR-402 (client script, motion-gated) and keeps the testid counts `08` expects.
- **C5** The 2-request third-party budget versus four listed analytics/spam sources: `@vercel/analytics` and `@vercel/speed-insights` are served same-origin from `/_vercel/*`, so Plausible (1) plus Turnstile (2) fills the budget exactly.
- **C6** Turnstile loads on **first interaction with the enquiry form**, not on page load, so its weight cannot touch LCP or the Performance score.
- **C7** The Plausible script tag renders only when `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, so local and CI runs emit no request and `01-page-load`'s zero-failed-requests assertion holds without an account.
- **C8** Tailwind 4's dynamic spacing scale is switched **off** (`--spacing: initial`), leaving only the nine three-based steps. `p-12` therefore means 12px, not Tailwind's default 48px, and `p-4` will not compile. Deliberate: it makes Section 6's "multiples of three throughout" a build-time constraint rather than a matter of discipline. Any new size must be added as a token.
- **C9** `box-shadow` is banned, which rules out Tailwind's `ring-*` utilities — all focus indicators use `outline`. Asserted against the built CSS by `scripts/check-bans.mjs`.
- **C10** Section 2 requires five axe states but `09` lists four. The fifth is `/legal`; `/thanks` is scanned as a sixth.
- **C11** `@nuxtjs/seo` bundles `nuxt-og-image`, which pulls in satori. Disabled via `ogImage: { enabled: false }` — SEO-04 specifies a separately designed static `/images/og.jpg`.
- **C12** Test `05` needs AVIF/WebP `content-type` under static prerender, so `@nuxt/image` generates variants at build time into `.output/public` rather than transforming on demand.
- **C13** `font-display: swap` is mandated but shifts layout. Mitigated by preloading both above-fold Switzer faces via `?url` imports in `app.vue`. **Deferred:** the `size-adjust`/`ascent-override` fallback metrics, which need the real font tables measured rather than guessed; CLS is gated empirically by LHCI at < 0.05 instead.

## M0 — Scaffold and gates

- **M0.1** `srcDir: '.'` pins Nuxt 4 back to a root-level tree (`components/`, `pages/`, `assets/`, `composables/`), because Nuxt 4 defaults to an `app/` srcDir and Section 7 mandates the root layout.
- **M0.2** Nitro uses the default Vercel preset with `routeRules` prerendering `/`, `/thanks` and `/legal`, **not** `vercel-static`. FR-009's "no route renders on demand" is satisfied for all three routes while `/api/enquiry` remains a function, which FR-911 requires.
- **M0.3** TypeScript pinned to **5.9.3**; the range resolved 7.0.2, which is outside `vue-tsc`'s supported `>=4.8.4 <6.1.0` and would break `pnpm typecheck`.
- **M0.4** `pnpm.onlyBuiltDependencies` approves `esbuild` and `unrs-resolver` postinstall scripts, which pnpm 10 blocks by default and which are needed to fetch native binaries.
- **M0.5** `vue-router` is not a direct dependency; Nuxt resolves it. Pinning it explicitly pulled 5.2.0 and broke the `^4` peer of both Vercel analytics packages.
- **M0.6** Three dev packages beyond Section 4's list, all needed to satisfy Section 14 and none reaching the bundle: `@vitest/coverage-v8` (the 90% coverage requirement), `happy-dom` (a DOM for `@vue/test-utils`), `@nuxt/test-utils`.
- **M0.7** `@nuxt/fonts` installed per Section 4 but with **every remote provider disabled**, and the three faces declared by hand in `main.css`. Left enabled, the module could fetch a fourth file and breach the 3-file limit.
- **M0.8** `@nuxtjs/turnstile` and the Vercel analytics packages are installed but **not registered** in `nuxt.config.ts` until M6 and M7 respectively, so M0's `verify` cannot fail on absent keys.
- **M0.9** `scripts/check-bans.mjs` added — the spec mandates Section 3's bans but is silent on enforcement. It asserts, against the built output: no `box-shadow`, no CSS gradient, no `border-radius` above 2px, no scroll listeners (M3), and no `div`/`span` carrying a click handler in component sources. Wired into `pnpm build` beside the FR-901 placeholder guard.
- **M0.10** CSP allows `script-src 'unsafe-inline'`, needed for Nuxt's hydration payload and C4's pre-paint motion flag. Lighthouse's `csp-xss` audit is informative and does not affect the Best Practices score. **Revisit at M8** with per-script hashes.
- **M0.11** Playwright and Lighthouse both default to a local `nuxt preview` server and switch to a deployed URL when `BASE_URL` is set, so `pnpm verify` is self-sufficient locally while CI can target a Vercel preview as Section 14 intends.
- **M0.12** Vitest coverage thresholds are configured but not enabled; they turn on at M6 when `schemas/enquiry.ts` and the enquiry handler exist. Enabling them against an empty include set fails the run.
- **M0.13** `pages/index.vue` is a throwaway scratch page proving the tokens compile; M1 replaces it wholesale with the layout shell.
- **M0.14** Tailwind's automatic source detection is **disabled** (`@import 'tailwindcss' source(none)`) and replaced with an explicit `@source` list covering `app.vue`, `components/`, `composables/`, `content/` and `pages/`. Left on, Tailwind scans every non-ignored file including `CLAUDE.md` and `DECISIONS.md` and turns bare words in prose into utilities — the word "shadow" in this file generated a real `.shadow` class carrying a `box-shadow`, which Section 3 bans outright. This also keeps the CSS honest: only classes actually used in templates are emitted.
- **M0.15** `chrome-launcher@1.2.1` is **patched** via `pnpm.patchedDependencies` (`patches/chrome-launcher@1.2.1.patch`). Its `destroyTmp()` calls `rmSync` on Chrome's temp profile directory; on Windows the crashpad handler keeps a handle after the browser exits, so this throws `EPERM` even with `maxRetries: 10`. The throw escapes `Launcher.kill()` and aborts the Lighthouse CLI *after* the audit completes but *before* results are written, making `lhci` — and therefore `pnpm verify` — unusable on Windows. The patch swallows only that teardown error. It cannot mask an audit failure, since it runs after results exist. Adds a `patches/` directory not present in Section 7's tree.
- **M0.16** `nitro.compressPublicAssets` enabled for gzip and brotli. Section 3's budget is 120KB **gzipped**, but Lighthouse measures *transfer* size — without pre-compression the local preview server reports raw bytes and the assertion compares against the wrong number. It initially read 211,010 bytes against a 122,880 budget; compressed it reads 72,715. This also matches how Vercel serves the assets, and it moved LCP from 2.73s to 2.0s.
- **M0.17** Root `tsconfig.json` is a **solution-style** file referencing Nuxt 4's four generated projects (`tsconfig.app/server/shared/node.json`), with strictness moved into `nuxt.config.ts` under `typescript.tsConfig`. Nuxt 4 no longer emits a single tsconfig to extend; setting `compilerOptions` in the root file instead broke auto-import type resolution (`Cannot find name 'useHead'`).
- **M0.18** `scripts/check-bans.mjs` permits `box-shadow: none`. Tailwind's Preflight uses it to strip Firefox's default `:-moz-ui-invalid` shadow, which serves the ban's intent rather than breaching it. Only a shadow that actually paints fails.
- **M0.19** `typescript` is pinned by a `pnpm.overrides` entry, not just a direct dependency. A direct pin left `@typescript-eslint/parser` resolving a nested 7.0.2 and `eslint .` aborted with "typescript-eslint does not support TS 7.0".
- **M0.21** M1 note: `playwright.config` originally set `reuseExistingServer: !isCI`. Because `pnpm verify` builds immediately before `test:e2e`, a preview server left running from an earlier build was silently reused and served **stale output**, hiding a title fix through several runs. Now always `false`.
- **M0.20** M0 measured, on the scratch page: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 2.0s, CLS 0.001, TBT 140ms, TTFB 10ms; total 129KiB across 16 requests, script 72,715B, fonts 3 files/47,589B, third-party 0. **Risk carried into M2:** LCP is at the 2.0s boundary with no hero image present, so FR-209's portrait needs care to stay inside budget.

## M1 — Layout shell

- **M1.1** `components: [{ path: '~/components', pathPrefix: false }]` so Section 7's nested tree still resolves to bare names like `<SectionShell>` rather than `<UiSectionShell>`.
- **M1.2** `--spacing-8: 8px` added as a deliberate exception to the three-based scale, because FR-203 specifies an 8px brass dot. Added as a token rather than an arbitrary value so templates stay token-only.
- **M1.3** `--nav-solid-threshold: 80px` introduced and used for **both** FR-102's scroll threshold and FR-006's `scroll-padding-top`. The spec states 80px twice for the same purpose; one token stops them drifting.
- **M1.4** `--text-proof: 2rem` added for FR-302's 32px proof values, and `measure-display` (16ch) to hold the H1 to three lines per FR-204.
- **M1.5** `app.head.titleTemplate: '%s'`. `@nuxtjs/seo` appends " | Aamir Butt" by default, which duplicated the name and broke SEO-01's verbatim title.
- **M1.6 — spec conflict.** SEO-01 specifies its title verbatim **and** annotates it "(under 60 characters)". The string it specifies is **64** characters. The verbatim string wins, since it is the concrete requirement; the parenthetical is wrong about its own value. `01-page-load` pins the length at 64 so it cannot grow further. **Worth Aamir's attention:** Google truncates titles around 60 characters, so the tail (", UK") may be cut in results.
- **M1.7** The nine `#collapse` step labels are authored. Section 9 supplies that section's prose but not the step names, and FR-401 requires a real named process. They are generic process vocabulary naming no organisation and asserting nothing factual (Section 17.1, 17.6).
- **M1.8** The footer's `rel="alternate"` link to `/aamir-butt.md` (SEO-10) is deferred to M7, when that asset is generated. Linking it at M1 would ship a 404, which the `link-checker` rule correctly rejected.
- **M1.9** `pages/index.vue` is wrapped in a single root `<div>` to satisfy `vue/no-multiple-template-root`. Landmarks are unaffected.
- **M1.10** Playwright `workers: 2` and `timeout: 60_000`. Headless Firefox on Windows falls back to the SWGL software compositor; at 4 workers an axe scan taking 7s in isolation blew past 60s. Wall-clock traded for a suite whose failures mean something.
- **M1.11** Keyboard-traversal assertions are skipped on WebKit projects. WebKit will not move focus to links with Tab unless macOS "Full Keyboard Access" is enabled, which Playwright cannot set. Covered instead by Section 16 items 6 and 8.
- **M1.12** The focus-order test detects the end of a tab cycle by either wrapping to the first element (Chromium) or parking on the last (headless Firefox). An earlier version pressed Tab a fixed 25 times and forbade all repeats, which failed on a page with 13 focusable elements — a flaw in the test, not the page.
- **M1.13** Two assertions emulate `prefers-reduced-motion: reduce` — the SC 2.4.11 landing-position check and FR-102's background change. Both were sampling mid-animation values (Firefox returned `rgba(233,232,227,0.625)` for a colour that settles to transparent). Reduced motion removes the transition per Section 6, leaving the state change itself observable.
- **M1.14** `lighthouserc.json` sets `aggregationMethod: "median"`. LHCI defaults to **optimistic**, which grades the best of three runs — it was passing the LCP gate on 1,980ms while the worst run measured 2,143ms. Section 3 calls these pass/fail gates, so the best-of-three default was understating them.
- **M1.15** Assertions that depend on later milestones are `test.fixme` with the milestone named, rather than omitted: JSON-LD and the machine assets (M7), the hero image (M2), FAQ-expanded and failed-validation axe states (M5, M6). They show as pending rather than silently missing.
- **M1.16** M1 measured: Accessibility 100, Best Practices 100, SEO 100, **Performance 94** (median of 90/95/91 → 94 after the median switch), LCP median 1,987ms, CLS 0, TBT 216–369ms, 139KiB total, script 77,894B, zero third-party. **Carried into M2:** performance is below the 95 target and LCP is within 13ms of its budget, with TBT the main drag. The category gates flip from warn to error at M2 (D9), so this must be fixed there, before the hero portrait adds weight.
