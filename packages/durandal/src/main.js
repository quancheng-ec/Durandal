const EventEmitter = require('events')
const { createServer } = require('http')

const debug = require('debug')('durandal:application')
const Koa = require('koa')
const koaBodyParser = require('koa-bodyparser')

const mergeConfig = require('./lib/mergeConfig')
const loadPlugins = require('./lib/loadPlugins')
const loadMiddlewares = require('./lib/loadMiddlewares')
const midErrHandler = require('./middlewares/errHandler')
const midRender = require('./middlewares/render')
const midResFormatter = require('./middlewares/resFormatter')
const midHealthCheck = require('./middlewares/healthCheck')
const midStore = require('./middlewares/store')
const midSaluki2 = require('./middlewares/saluki2')
const midJwt = require('./middlewares/jwt')
const midBizThrow = require('./middlewares/bizThrow')
const midRespond = require('./middlewares/respond')
const midVilidator = require('./middlewares/validator')
const { initRouter, unhandledRoute } = require('./lib/router')

class App extends EventEmitter {
  constructor (config) {
    super()
    this.app = this.initApp(config)
    this.config = this.app.config
    this.server = createServer(this.app.callback())
  }

  initApp (config) {
    debug('load config')
    config = mergeConfig(config)
    debug(config)
    const app = new Koa()
    debug('initializing router')
    const { router, noAuthRoutes } = initRouter(config.route)
    app.keys = ['durandal']

    app.secret = config.jwtSecret || 'durandal-secret'
    app.config = config
    app.context.config = config

    loadPlugins(app.context, config)

    app.use(midErrHandler(config))
    app.use(midBizThrow(config))
    app.use(midVilidator(config))
    app.use(midStore(app, config))
    if (config.saluki2) {
      app.use(midSaluki2(app, config))
    }
    if (config.auth && config.auth.enabled) {
      app.use(midJwt(app, config, noAuthRoutes))
    }
    app.use(
      koaBodyParser({
        jsonLimit: '10mb',
        textLimit: '10mb'
      })
    )
    loadMiddlewares(app, config)
    app.use(midRespond(config))
    app.use(midRender(config))
    app.use(midResFormatter(config))
    app.use(midHealthCheck(config))
    app.use(unhandledRoute)
    app.use(router.routes())
    app.use(router.allowedMethods({ throw: true }))

    return app
  }

  startServer () {
    debug('starting server')
    this.server.listen(this.config.port)
    console.log(`server is running on port: ${this.config.port}`)
  }
}

process.on('uncaughtException', err => {
  console.dir(err)
})

process.on('exit', info => {
  console.dir(info)
})

module.exports = exports = config => {
  const app = new App(config)
  return app
}
