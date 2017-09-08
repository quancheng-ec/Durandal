const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const debug = require('debug')('durandal:jwt')

module.exports = (app, config, noAuthRoutes) => {
  config.auth = config.auth || {}

  const jwtOptions = {
    tokenKey: 'jwtToken',
    async secret() {
      return app.secret
    },
    async isRevoked(ctx, decodedToken, token) {
      const expiredTime = config.auth.expired || 60
      const tokenStatus = await ctx.redis.get(token)
      debug(`token status: ${tokenStatus}`)
      debug(`token has been issued for : ${Math.floor(Date.now() / 1000) - decodedToken.iat} seconds`)
      if (tokenStatus === 'invalid' || Math.floor(Date.now() / 1000) - decodedToken.iat > expiredTime) {
        debug(`token is revoked`)
        return Promise.resolve(true)
      }
      debug(`token is not revoked`)
      return Promise.resolve(false)
    }
  }
  debug(`ignored path: ${noAuthRoutes.concat(config.auth.exclude)}`)
  app.use(koaJwt(jwtOptions).unless({ path: noAuthRoutes.concat(config.auth.exclude) }))

  return async (ctx, next) => {
    ctx.jwt = jwt
    await next()
  }
}