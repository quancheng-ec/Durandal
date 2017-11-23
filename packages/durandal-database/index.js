const Sequelize = require('sequelize')
const { readdirSync } = require('fs')
const { resolve } = require('path')
const camelCase = require('lodash.camelcase')
const upperFirst = require('lodash.upperfirst')
const debug = require('debug')('durandal:plugin-database')

exports.name = 'database'
exports.install = async (ctx, config, globalConfig) => {
  debug('initializing database connection: ')
  debug(config)
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.type || 'mysql',
    timezone: 'Asia/Shanghai',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

  ctx.database = sequelize
  ctx.database.tables = {}

  ctx.database.helpers = {
    op: Sequelize.Op,
    Sequelize
  }

  const modelDir = globalConfig.model && globalConfig.model.path
  debug(`model dir: ${modelDir}`)
  if (!modelDir) return debug('no model found or model dir not set properly')

  readdirSync(modelDir).map(dir => {
    const model = require(resolve(modelDir, dir))
    const modelConfig = Object.assign({ tableName: model.table }, model.config)
    const modelDefinition = {}
    Object.keys(model.definitions).map(def => {
      modelDefinition[def] = Sequelize[model.definitions[def]]
    })
    debug(`initialized model from table: ${model.table}`)
    ctx.database.tables[upperFirst(camelCase(model.table))] = sequelize.define(model.table, modelDefinition, modelConfig)
  })
}
