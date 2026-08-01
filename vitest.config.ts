import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Matches Nuxt's ~ alias so unit tests import modules the same way the app
    // does, rather than by relative path.
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      /**
       * Scoped to the two units Section 14 names: the zod schema and the
       * enquiry handler's decision logic. Everything else in composables/ and
       * server/ is browser or Nitro bound and is covered end to end instead --
       * including it here would report a meaningless 0% and make the threshold
       * unenforceable. useReveal's predicate is unit tested separately (C3).
       */
      include: ['schemas/enquiry.ts', 'server/utils/enquiry.ts'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
