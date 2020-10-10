/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */

const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  devtool: 'none',
  mode: 'production',
})
