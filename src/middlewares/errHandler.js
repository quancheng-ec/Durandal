const { resolve } = require('path')

module.exports = (opts = {}) => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = {
        success: false,
        status: ctx.status,
        message: error.message,
        data: {}
      }
      ctx.app.emit('error', error, ctx)
    }
  }
}
