const consul = require('./lib/consul')
const client = require('./lib/grpcClient')

const _apis = {}
exports.name = 'saluki'
exports.install = async (ctx, config, globalConfig) => {
  if (!config) return
  await consul.init(config)
  Object.assign(_apis, await client.init(config))
  ctx.salukiServices = _apis
}
