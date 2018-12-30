const properties = require('../common/properties')
const makeResult = require('../result')

function DNSCacheManager (node) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.options.hosts = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result.options.hosts)
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized DNSCacheManager attribute: ' + key)
  }
}

function property (node, hosts) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
    case 'servers':
    case 'clearEachIteration':
    case 'isCustomResolver':
      break
    case 'hosts': {
      const entries = node.children.filter(node => /Prop$/.test(node.name))
      for (const entry of entries) Object.assign(hosts, host(entry))
      break
    }
  }
}

function host (node) {
  const props = properties(node)
  if (!(props.Name && props.Address)) {
    throw new Error('Invalid static host table entry')
  }
  return { [props.Name]: props.Address }
}

module.exports = DNSCacheManager
