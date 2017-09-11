const { resolve } = require('path')

const setStatus = errorStatus => {
  if (!errorStatus) return 500
  return errorStatus >= 600 ? 403 : errorStatus
}

module.exports = (opts = {}) => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (error) {
      const isBizError = error.constructor.name === 'BizError'
      ctx.status = isBizError ? 200 : setStatus(error.status)
      ctx.body = {
        success: isBizError,
        code: error.status,
        message: error.message,
        data: {}
      }
      ctx.app.emit('error', error, ctx)
    }
  }
}
