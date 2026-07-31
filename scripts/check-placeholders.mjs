#!/usr/bin/env node
/**
 * FR-901: placeholder build guard.
 *
 * Scans the built output for the string `TODO_`. Exits 1 if any match is found
 * AND process.env.VERCEL_ENV === 'production'. Exits 0 on preview and local
 * builds.
 *
 * This lets the site deploy to preview with visible gaps, and blocks a
 * production launch carrying fake or missing facts.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { existsSync } from 'node:fs'

const OUTPUT_DIR = '.output/public'
const NEEDLE = 'TODO_'
const SCANNED_EXTENSIONS = ['.html', '.js', '.mjs', '.css', '.json', '.txt', '.md', '.xml']
const isProduction = process.env.VERCEL_ENV === 'production'

/** @param {string} dir @returns {AsyncGenerator<string>} */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (SCANNED_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) yield full
  }
}

if (!existsSync(OUTPUT_DIR)) {
  console.error(`check-placeholders: ${OUTPUT_DIR} not found. Run the build first.`)
  process.exit(1)
}

/** @type {Map<string, Set<string>>} */
const hits = new Map()

for await (const file of walk(OUTPUT_DIR)) {
  const contents = await readFile(file, 'utf8')
  if (!contents.includes(NEEDLE)) continue

  const tokens = new Set(contents.match(/TODO_[A-Z0-9_]*/g) ?? [NEEDLE])
  hits.set(relative(OUTPUT_DIR, file), tokens)
}

if (hits.size === 0) {
  console.log('check-placeholders: no TODO_ placeholders in the build output.')
  process.exit(0)
}

const allTokens = [...new Set([...hits.values()].flatMap((set) => [...set]))].sort()

console.log(
  `\ncheck-placeholders: ${allTokens.length} unfilled placeholder(s) across ${hits.size} file(s).\n`,
)
for (const token of allTokens) console.log(`  ${token}`)
console.log('\nFiles:')
for (const [file, tokens] of hits) console.log(`  ${file}  (${[...tokens].join(', ')})`)

if (isProduction) {
  console.error(
    '\nFAIL: VERCEL_ENV=production and placeholders remain. Fill every value in\n' +
      'content/site.ts before launching. See CLAUDE.md Section 5.\n',
  )
  process.exit(1)
}

console.log(
  '\nPreview/local build: placeholders permitted. A production build with these would fail.\n',
)
process.exit(0)
