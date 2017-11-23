const { readdirSync } = require('fs')
const { resolve } = require('path')
const compose = require('koa-compose')
module.exports = exports = function loadMiddleware (app, config) {
  if (!config.middleware || !config.middleware.path) return
  try {
    const middlewares = readdirSync(config.middleware.path)
      .map(path => require(resolve(config.middleware.path, path)))
      .sort(mid => mid.priority)
      .map(({ middleware }) => middleware(config))
    app.use(compose(middlewares))
  } catch (e) {
    console.error(e)
  }
}
