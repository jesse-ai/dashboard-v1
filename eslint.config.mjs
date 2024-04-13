// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'no-console': 'off', // allow console.log in TypeScript files
      'vue/no-multiple-template-root': 'off',
      '@stylistic/indent': ['error', 2],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      '@stylistic/no-multiple-empty-lines': 0,
      '@stylistic/no-trailing-spaces': 2,
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      }],
      'prefer-const': 'error',
      '@stylistic/padded-blocks': 'warn',
      '@stylistic/comma-dangle': 0,
      'no-unused-vars': 'warn',
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'error',
      'vue/max-attributes-per-line': ['error', {
        singleline: 4,
        multiline: {
          max: 1,
        },
      }],
      '@stylistic/no-extra-semi': 'warn',
      'vue/no-mutating-props': 'off',
      'vue/no-v-html': 'off',
    },
  },
)
