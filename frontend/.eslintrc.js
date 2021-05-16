const config = require('../.eslintrc')

// We remove the typescript plugin, because our frontend app is still plain .js
config.plugins = []

module.exports = config
