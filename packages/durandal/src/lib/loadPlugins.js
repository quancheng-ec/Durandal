const debug = require('debug')('durandal:plugins')
const { resolve } = require('path')
const { isString, extend } = require('lodash')
module.exports = exports = async function loadPlugins (ctx, config) {
  if (!config.plugins || !config.plugins.length) {
    return debug('no plugins to load')
  }

  for (const plugin of config.plugins) {
    const pluginObj = {}
    if (isString(plugin)) {
      extend(pluginObj, {
        package: plugin,
        options: {}
      })
    } else {
      extend(pluginObj, plugin)
    }
    try {
      const pluginDir = resolve(config.root, 'node_modules', pluginObj.package)
      debug(`find ${pluginObj.package} package in dir: ${pluginDir}`)
      const plugin = require(pluginDir)
      debug(`installing ${pluginObj.package}`)
      await plugin.install(ctx, pluginObj.options, config)
    } catch (e) {
      console.error('plugin load failed for')
      console.error(e)
      continue
    }
  }
}
