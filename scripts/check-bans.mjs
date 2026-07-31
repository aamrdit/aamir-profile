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

const OUTPUT_DIR = '.output/public'
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

/** @type {string[]} */
const failures = []

// --- Built CSS: no shadows, no gradients, no radius above 2px ---------------
for await (const file of walk(OUTPUT_DIR, ['.css'])) {
  const css = await readFile(file, 'utf8')
  const where = relative(OUTPUT_DIR, file)

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
for await (const file of walk(OUTPUT_DIR, ['.js', '.mjs'])) {
  const js = await readFile(file, 'utf8')
  if (/addEventListener\(\s*["'`]scroll["'`]/.test(js)) {
    failures.push(
      `${relative(OUTPUT_DIR, file)}: scroll event listener found. Use ` +
        'IntersectionObserver (FR-406, M3 acceptance).',
    )
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
