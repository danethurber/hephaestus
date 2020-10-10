/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/modules/*', '<rootDir>/shared/*'],

  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    '<rootDir>/modules/*/src/**/*.{ts,tsx}',
    '<rootDir>/shared/*/src/**/*.{ts,tsx}',
  ],
}
