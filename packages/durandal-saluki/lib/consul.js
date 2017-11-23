let _consul
const _services = {}

module.exports = {
  init: async function init (opts = {}) {
    _consul = require('consul')({
      promisify: fromCallback,
      host: opts.host || '127.0.0.1',
      port: opts.port || '8500'
    })
    const group = opts.group ? opts.group : 'default'
    module.exports.initWidthGroup(group)
  },
  initWidthGroup: async function (group) {
    console.log('init consul client widthgroup ' + group)
    const sgroup = 'saluki_' + group
    const func = async function () {
      try {
        _services[group] = await _init(sgroup, group)
      } catch (e) {
        console.error('sync consul error!', e)
      }
      setTimeout(func, 10000)
    }
    setTimeout(func, 0)
  },
  setServices: function (services) {
    Object.assign(_services, services)
  },
  getALL: function () {
    return _services
  },
  getService: function (api) {
    if (_services[api.group]) {
      return _services[api.group][api.name]
    }
    return _services
  },
  consulClient: () => _consul
}

function fromCallback (fn) {
  return new Promise((resolve, reject) => {
    try {
      return fn(function (err, data, res) {
        if (err) {
          err.res = res
          return reject(err)
        }
        return resolve([
          data,
          res
        ])
      })
    } catch (err) {
      return reject(err)
    }
  })
}

async function _init (consulNode, group) {
  let checks = await _consul.health.service({
    service: consulNode,
    passing: true
  })
  const services = {}
  checks[0].forEach(function (c) {
    const s = c.Service
    const ids = s.ID.split('-')
    const name = ids[1]
    const service = {
      name: name,
      host: ids[0],
      address: s.Address,
      port: s.Port,
      version: ids[2],
      group: group
    }
    let ss = []
    if (services[service.name]) {
      ss = services[service.name]
    } else {
      services[service.name] = ss
    }
    services[service.name].push(service)
  })
  return services
}
