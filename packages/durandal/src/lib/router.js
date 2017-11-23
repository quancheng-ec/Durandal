const { resolve } = require('path')
const { METHODS } = require('http')
const debug = require('debug')('durandal:router')

const Router = require('koa-router')
const { readdirSync } = require('fs-extra')
const validate = require('validate.js')

const $route = new Map()

validate.validators.presence.options = { message: "can't be empty" }

const logRouter = (ctrl, needDetail = false) => {
  return async (ctx, next) => {
    console.log('')
    debug(`${ctrl}: ${ctx.path}`)
    if (needDetail) {
      debug(`query:`, ctx.querystring)
      debug(`data:`, ctx.request.body)
    }
    console.log('')
    await next()
  }
}

exports.unhandledRoute = async (ctx, next) => {
  await next()
  if (!ctx._matchedRoute) {
    ctx.throw(404, 'Route not found')
  }
}

exports.initRouter = (opts = {}) => {
  const globalPrefix = opts.prefix || ''

  const router = new Router({
    prefix: globalPrefix
  })

  const noAuthRoutes = []

  if (opts.path) {
    const routerChildFolders = readdirSync(opts.path)
    const r = path => resolve(opts.path, path)

    for (const path of routerChildFolders) {
      require(r(path))
    }

    for (let [
      controller,
      config
    ] of $route) {
      if (config.skipAuth) noAuthRoutes.push(globalPrefix + config.url)
      const beforeRoute = opts.before ? [
        logRouter('enter route', true),
        opts.before.bind(config),
        ...config.middlewares
      ] : config.middlewares
      const args = [
        config.target.constructor.name + '.' + config.name,
        config.url,
        ...beforeRoute,
        async (ctx, next) => {
          await controller.call(config.target, ctx, ctx.services)
          await next()
        },
        logRouter('leave route')
      ]

      if (opts.after) args.push(opts.after.bind(config))

      router[config.method].apply(router, args)
    }
  }

  return {
    router,
    noAuthRoutes
  }
}

exports.RouteMap = (url, method, ...middlewares) => {
  return (target, name, value) => {
    middlewares = middlewares.map(mid => mid.bind(target))
    if (target[name]._validateMiddleware) {
      middlewares.push(target[name]._validateMiddleware)
    }
    const skipAuth = target[name]._skipAuth
    $route.set(target[name], {
      target,
      url,
      method,
      middlewares,
      name,
      skipAuth
    })
    debug(`route mounted: ${url}, method: ${method}${skipAuth ? ', ignore auth' : ''}`)
  }
}

exports.SkipAuth = () => (target, name, value) => {
  target[name]._skipAuth = true
}

exports.RouteParam = params => {
  return (target, name, value) => {
    target[name]._validateMiddleware = async (ctx, next) => {
      try {
        await validate.async(ctx.query, params, { format: 'flat' })
      } catch (error) {
        console.dir(error)
        return ctx.throw(400, new Error(error))
      }

      await next()
    }
  }
}

const RouteMethods = {}

for (const method of METHODS) {
  RouteMethods[method] = method.toLowerCase()
}

exports.RouteMethods = RouteMethods
