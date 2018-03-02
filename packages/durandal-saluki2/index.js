const Saluki2Client = require('qccost-saluki2-node')

exports.name = 'saluki2'
exports.install = async (ctx, config, globalConfig) => {
  if (!config) return
  const client = new Saluki2Client(config)
  client.init()
  ctx.salukiServices = client.services
}
