module.exports = (opts = {}) => {
  return async function resFormatter(ctx, next) {
    await next()
    ctx.body = {
      success: true,
      status: 0,
      data: ctx.body
    }
  }
}
