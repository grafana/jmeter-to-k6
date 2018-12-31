const properties = require('../common/properties')
const makeResult = require('../result')

function CookieManager (node, defaults) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized CookieManager attribute: ' + key)
  }
}

function property (node, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
    case 'clearEachIteration':
    case 'policy':
      break
    case 'cookies': {
      result.imports.add('k6/http')
      const entries = node.children.filter(node => /Prop$/.test(node.name))
      for (const entry of entries) cookie(entry, result)
      break
    }
    default: throw new Error('Unrecognized CookieManager property: ' + name)
  }
}

function cookie (node, result) {
  const props = properties(node)
  const spec = { value: props.value || '' }
  if (props.domain) spec.domain = props.domain
  if (props.path) spec.path = props.path
  if ('secure' in props) spec.secure = !!props.secure
  const name = node.attributes.name
  result.cookies.set(name, spec)
}

module.exports = CookieManager
