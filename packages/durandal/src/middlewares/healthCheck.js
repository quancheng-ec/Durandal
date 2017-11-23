module.exports = options => async (ctx, next) => {
  if (ctx.path.startsWith('/healthCheck')) {
    ctx.body = {
      status: 'healthy'
    }
    return
  }
  await next()
}