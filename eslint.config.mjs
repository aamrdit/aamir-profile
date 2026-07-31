// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.nuxt/**',
    '.output/**',
    '.vercel/**',
    'coverage/**',
    'test-results/**',
    'playwright-report/**',
    'blob-report/**',
    '.lighthouseci/**',
    'assets/fonts/**',
    // Vendored Claude Code skills. Note: .claude/skills/find-skills is an NTFS
    // junction into .agents/skills/find-skills -- do not let tooling follow it.
    '.agents/**',
    '.claude/**',
    '.playwright/**',
    '.playwright-cli/**',
  ],
  rules: {
    // Section 3: no div/span standing in for <a> or <button>. The build-time
    // guard in scripts/check-bans.mjs catches the template cases ESLint
    // cannot see; 03-cta asserts it again at runtime.
    'vue/no-static-inline-styles': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-self-closing': 'off',
  },
})
