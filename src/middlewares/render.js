const pug = require('pug')
const { resolve } = require('path')

const render = options => (tpl, data) => pug.compileFile(tpl, options)(data)

module.exports = options => {
  return async (ctx, next) => {
    ctx.render = render(options)
    await next()
  }
}