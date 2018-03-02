const set = require('lodash.set')
const debug = require('debug')('durandal:config')

module.exports = config => {
  config = Object.assign({}, config)

  for (const arg of Object.keys(process.env)) {
    if (arg.startsWith('durandal_')) {
      const configPath = arg.replace('durandal_', '').replace(/_/gi, '.')
      set(config, configPath, process.env[arg])
      debug(`merge env to config.${configPath}: ${process.env[arg]}`)
    }
  }

  return config
}
