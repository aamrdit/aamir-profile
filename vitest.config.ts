import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['schemas/**/*.ts', 'server/**/*.ts', 'composables/**/*.ts'],
      // Section 14 requires 90% on schemas/enquiry.ts and the enquiry handler.
      // Thresholds are enabled at M6 when those files exist; enabling them
      // against an empty include set fails the run. See DECISIONS.md.
    },
  },
})
