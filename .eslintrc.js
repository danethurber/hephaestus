/* eslint-env node */

const IGNORE = 0
const WARNING = 1
const ERROR = 2

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',

    // NOTE: this must be the last item in the array
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': IGNORE,
    '@typescript-eslint/no-unsafe-assignment': IGNORE,
    '@typescript-eslint/no-unsafe-call': IGNORE,
    '@typescript-eslint/no-unsafe-member-access': WARNING,
    '@typescript-eslint/no-unsafe-return': IGNORE,
    '@typescript-eslint/no-unused-vars': [WARNING, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/restrict-template-expressions': WARNING,
    '@typescript-eslint/restrict-plus-operands': WARNING,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': IGNORE,
        '@typescript-eslint/no-unsafe-call': IGNORE,
      },
    },
  ],
}
