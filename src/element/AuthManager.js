const { Authentication } = require('../symbol')
const properties = require('../common/properties')
const makeResult = require('../result')

function AuthManager (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = []
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (settings.length) result.defaults.push({ [Authentication]: settings })
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized AuthManager attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'auth_list': {
      const entries = node.children.filter(node => /Prop$/.test(node.name))
      for (const entry of entries) settings.push(credential(entry, context))
      break
    }
    default: throw new Error('Unrecognized AuthManager property: ' + name)
  }
}

function credential (node, context) {
  const props = properties(node, context)
  if (!(props.url && props.username && props.password)) {
    throw new Error('Invalid credential')
  }
  const spec = {
    url: props.url,
    username: props.username,
    password: props.password
  }
  if (props.domain) spec.domain = props.domain
  if (props.realm) spec.realm = props.realm
  spec.mechanism = props.mechanism || 'BASIC'
  switch (spec.mechanism) {
    case 'BASIC':
    case 'DIGEST':
    case 'KERBEROS':
      break
    default:
      throw new Error('Unsupported auth mechanism: ' + spec.mechanism)
  }
  return spec
}

module.exports = AuthManager
