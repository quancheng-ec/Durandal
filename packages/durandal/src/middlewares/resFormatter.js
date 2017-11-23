module.exports = (opts = {}) => {
  return async function resFormatter(ctx, next) {
    await next()
    ctx.body = {
      success: !ctx.state._respondCode,
      code: ctx.state._respondCode || 0,
      data: ctx.body,
      message: ctx.state._respondMessage || ''
    }
  }
}
