/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config.base')
const { name } = require('./package')

module.exports = {
  ...baseConfig,
  displayName: name,
  name: name,
  roots: ['<rootDir>/modules/feyds-spell-marker'],
}
