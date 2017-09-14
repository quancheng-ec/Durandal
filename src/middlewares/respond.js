function respond(data, code, message) {
  this.body = data
  this.state._respondMessage = message
  this.state._respondCode = code
}

module.exports = (opts = {}) => {
  return async (ctx, next) => {
    ctx.respond = respond.bind(ctx)
    ctx.success = (data, message) => respond.call(ctx, data, 0, message)
    ctx.fail = (bizErrorCode, message, data = {}) => respond.call(ctx, data, bizErrorCode, message)
    await next()
  }
}