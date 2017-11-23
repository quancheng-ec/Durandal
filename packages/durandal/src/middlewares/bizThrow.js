class BizError extends Error {
  constructor() {
    super()
  }
}

module.exports = (options = {}) => {
  return async (ctx, next) => {
    ctx.bizThrow = (errCode, message) => {
      const error = new BizError()
      error.status = errCode
      error.message = message
      throw error
    }
    await next()
  }
}