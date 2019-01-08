const { Authentication } = require('../symbol')
const properties = require('../common/properties')
const makeResult = require('../result')

function AuthManager (node) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, settings)
  if (Object.keys(settings).length) {
    result.defaults.push({ [Authentication]: settings })
  }
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized AuthManager attribute: ' + key)
  }
}

function property (node, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'auth_list': {
      const entries = node.children.filter(node => /Prop$/.test(node.name))
      for (const entry of entries) Object.assign(settings, credential(entry))
      break
    }
    default: throw new Error('Unregoznied AuthManager property: ' + name)
  }
}

function credential (node) {
  const props = properties(node)
  if (!(props.url && props.password)) throw new Error('Invalid credential')
  const spec = { password: props.password }
  if (props.username) spec.username = props.username
  if (props.domain) spec.domain = props.domain
  if (props.realm) spec.realm = props.realm
  return { [props.url]: spec }
}

module.exports = AuthManager
