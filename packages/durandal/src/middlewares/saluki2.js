const Saluki2Client = require('@quancheng/saluki2-node')

module.exports = (app, opts) => {
  const client = new Saluki2Client(opts)
  client.init()
  app.services = client.services

  return async (ctx, next) => {
    ctx.services = client.services
    await next()
  }
}