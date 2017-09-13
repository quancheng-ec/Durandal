const validator = require('validator')

module.exports = (opts = {}) => {
  return async (ctx, next) => {
    ctx.validator = validator
    await next()
  }
}