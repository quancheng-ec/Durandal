module.exports = (opts = {}) => {
  return async function resFormatter(ctx, next) {
    await next()
    ctx.body = {
      success: true,
      data: ctx.body
    }
  }
}
