module.exports = options => async (ctx, next) => {
  console.log(ctx.path)
  if (ctx.path.startsWith('/healthCheck')) {
    ctx.body = {
      status: 'healthy'
    }
    return
  }
  await next()
}