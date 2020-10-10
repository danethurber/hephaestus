/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: __dirname,

  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
