const { join } = require('node:path')
const { cosmiconfigSync } = require('cosmiconfig')

const defaultConfig = { '*': ['npx git-validator lint --fix'] }

module.exports = cosmiconfigSync('lint-staged').search(join(__dirname, '..'))?.config ?? defaultConfig
