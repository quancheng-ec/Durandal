module.exports = (opts = {}) => {
  return async (ctx, next) => {
    ctx.success = opts.successResponse ?
      opts.successResponse.bind(ctx)
      :
      (data, message) => {
        ctx.body = data
        ctx.state._successMessage = message
      }

    await next()
  }
}