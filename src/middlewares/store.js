const redisStore = require('koa-redis')
const session = require('koa-session')

const sessionDefault = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true
}

module.exports = (app, config) => {
  const redisServer = redisStore(config.redis)
  const sessionConfig = Object.assign(sessionDefault, config.session, {
    store: redisServer
  })

  app.use(session(sessionConfig, app))

  return async (ctx, next) => {
    ctx.redis = redisServer.client
    await next()
  }
}