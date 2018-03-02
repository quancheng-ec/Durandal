module.exports = config => {
  return async (ctx, next) => {
    await next()
  }
}
