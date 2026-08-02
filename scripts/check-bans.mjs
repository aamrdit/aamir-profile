#!/usr/bin/env node
/**
 * Section 3 "Banned outright" build guard.
 *
 * ESLint cannot see into compiled CSS, and several of Section 3's bans are
 * about the built artefact rather than the source. This script asserts them
 * against .output/public and the component sources, and is wired into the
 * build. See DECISIONS.md -- the spec mandates the bans but is silent on how
 * to enforce them.
 *
 * Checked here:
 *   - box-shadow anywhere in the built CSS
 *   - CSS gradients (linear-gradient, radial-gradient, conic-gradient)
 *   - border-radius above 2px
 *   - scroll event listeners in the built JS (M3 acceptance criterion)
 *   - div/span carrying a click handler in the component sources
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { existsSync } from 'node:fs'

/**
 * The Vercel preset writes to .vercel/output/static; the node-server preset
 * writes to .output/public. EVERY existing output is scanned, not the first
 * match: locally both directories can exist at once, and picking one silently
 * checked a stale build while reporting success.
 */
const OUTPUT_CANDIDATES = ['.output/public', '.vercel/output/static']
const OUTPUT_DIRS = OUTPUT_CANDIDATES.filter((dir) => existsSync(dir))
const SOURCE_DIRS = ['components', 'pages', 'layouts']

/** @param {string} dir @param {string[]} exts @returns {AsyncGenerator<string>} */
async function* walk(dir, exts) {
  if (!existsSync(dir)) return
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full, exts)
    else if (exts.some((ext) => entry.name.endsWith(ext))) yield full
  }
}

/** Yields [outputDir, file] across every build output present. */
async function* walkOutputs(exts) {
  for (const dir of OUTPUT_DIRS) {
    for await (const file of walk(dir, exts)) yield [dir, file]
  }
}

if (OUTPUT_DIRS.length === 0) {
  console.error(
    `check-bans: no build output found. Looked for ${OUTPUT_CANDIDATES.join(' and ')}.`,
  )
  process.exit(1)
}

/** @type {string[]} */
const failures = []

// --- Built CSS: no shadows, no gradients, no radius above 2px ---------------
for await (const [outDir, file] of walkOutputs(['.css'])) {
  const css = await readFile(file, 'utf8')
  const where = relative(outDir, file)

  // `box-shadow: none` is permitted -- Tailwind's Preflight uses it to strip
  // Firefox's default :-moz-ui-invalid shadow, which is the ban's intent, not
  // a breach of it. Any shadow that actually paints is a failure.
  if (/box-shadow\s*:\s*(?!none\b)/i.test(css)) {
    failures.push(`${where}: box-shadow is banned outright (Section 3).`)
  }
  if (/(linear|radial|conic)-gradient\s*\(/i.test(css)) {
    failures.push(`${where}: CSS gradients are banned outright (Section 3).`)
  }

  // Radius ceiling is 2px. Flag any px/rem/em radius above it. Percentages and
  // 0 are fine; `9999px` on a pill is exactly what this is meant to catch.
  for (const match of css.matchAll(/border-radius\s*:\s*([^;}]+)/gi)) {
    const value = match[1] ?? ''
    for (const num of value.matchAll(/(\d*\.?\d+)(px|rem|em)/gi)) {
      const raw = Number.parseFloat(num[1] ?? '0')
      const px = (num[2] ?? 'px').toLowerCase() === 'px' ? raw : raw * 16
      if (px > 2) {
        failures.push(`${where}: border-radius ${num[0]} exceeds the 2px ceiling.`)
      }
    }
  }
}

// --- Built JS: no scroll listeners (FR-406, M3) ----------------------------
for await (const [outDir, file] of walkOutputs(['.js', '.mjs'])) {
  const js = await readFile(file, 'utf8')
  if (/addEventListener\(\s*["'`]scroll["'`]/.test(js)) {
    failures.push(
      `${relative(outDir, file)}: scroll event listener found. Use ` +
        'IntersectionObserver (FR-406, M3 acceptance).',
    )
  }
}

// --- Every referenced image variant must exist as a file -------------------
//
// @nuxt/image emits /_ipx/ URLs into the HTML, but only actually writes those
// files under some presets. Under the Vercel preset it did not, leaving the
// hero and about portraits pointing at 404s. nuxt.config lists the variants
// explicitly in prerender.routes; this makes sure that list cannot fall out of
// step with what the templates ask for.
{
  /** @type {Set<string>} */
  const referenced = new Set()
  for await (const [outDir, file] of walkOutputs(['.html'])) {
    const html = await readFile(file, 'utf8')
    for (const match of html.matchAll(/["'\s](\/_ipx\/[^"'\s]+)/g)) {
      if (match[1]) referenced.add(`${outDir}|${match[1].replace(/&amp;/g, '&')}`)
    }
  }

  for (const entry of [...referenced].sort()) {
    const [outDir, url] = entry.split('|')
    const onDisk = join(outDir, decodeURIComponent(url))
    if (!existsSync(onDisk)) {
      failures.push(
        `${outDir}${url}: referenced by an <img> but not generated. Add it to ` +
          'nitro.prerender.routes in nuxt.config.ts (DECISIONS.md M9.1).',
      )
    }
  }
}

// --- Zero-value utilities must actually exist in the built CSS -------------
//
// main.css sets `--spacing: initial` to force the three-based scale (C8). The
// side effect is that Tailwind compiles every zero-value utility as
// `calc(var(--spacing) * 0)`, which is invalid, so those rules are dropped
// from the stylesheet SILENTLY. That broke the fixed header's width, the
// mobile overlay, and eight min-w-0 guards, and no test noticed -- the
// assertions check computed positions, never whether a requested class exists.
//
// `--spacing-0: 0px` fixes it; this guard makes sure it stays fixed.
{
  const builtCss = []
  for await (const [, file] of walkOutputs(['.css'])) {
    builtCss.push(await readFile(file, 'utf8'))
  }
  const allCss = builtCss.join('\n')

  /** @type {Set<string>} */
  const requested = new Set()
  for (const dir of SOURCE_DIRS) {
    for await (const file of walk(dir, ['.vue'])) {
      const source = await readFile(file, 'utf8')
      for (const match of source.matchAll(/[\s"'`:]((?:-?[a-z][a-z-]*)-0)(?=[\s"'`]|$)/g)) {
        if (match[1]) requested.add(match[1])
      }
    }
  }

  for (const utility of [...requested].sort()) {
    if (!allCss.includes(utility)) {
      failures.push(
        `${utility}: used in a template but absent from the built CSS. ` +
          'Zero-value utilities need a named --spacing-0 token while the ' +
          'dynamic spacing scale is disabled (DECISIONS.md C8a).',
      )
    }
  }
}

// --- Sources: no div/span standing in for <a> or <button> ------------------
for (const dir of SOURCE_DIRS) {
  for await (const file of walk(dir, ['.vue'])) {
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(/<(div|span)\b[^>]*?(@click|v-on:click|onclick)/gi)) {
      failures.push(
        `${file}: <${match[1]}> carries a click handler. Use <a> or <button> ` +
          '(Section 3).',
      )
    }
  }
}

if (failures.length > 0) {
  console.error(`\ncheck-bans: ${failures.length} violation(s) of Section 3.\n`)
  for (const failure of failures) console.error(`  ${failure}`)
  console.error('')
  process.exit(1)
}

console.log('check-bans: no Section 3 violations.')
