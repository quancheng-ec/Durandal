const { resolve } = require('path')

const setStatus = errorStatus => {
  if (errorStatus) return 500
  return errorStatus >= 600 ? 403 : errorStatus
}

module.exports = (opts = {}) => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        success: true,
        status: error.status,
        message: error.message,
        data: {}
      }
      ctx.app.emit('error', error, ctx)
    }
  }
}
