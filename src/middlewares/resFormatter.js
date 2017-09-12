module.exports = (opts = {}) => {
  return async function resFormatter(ctx, next) {
    await next()
    ctx.body = {
      success: true,
      code: 0,
      data: ctx.body,
      message: ctx.state._successMessage || ''
    }
  }
}
