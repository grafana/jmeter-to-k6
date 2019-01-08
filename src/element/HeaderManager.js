const properties = require('../common/properties')
const makeResult = require('../result')

function HeaderManager (node) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.constants.set('headers', new Map())
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized HeaderManager attribute: ' + key)
  }
}

function property (node, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      break
    case 'headers':
      headers(node, result)
      break
    default: throw new Error('Unrecognized HeaderManager property: ' + name)
  }
}

function headers (node, result) {
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) header(prop, result)
}

function header (node, result) {
  const props = properties(node)
  if (!(props.name && props.value)) throw new Error('Invalid header entry')
  result.constants.get('headers').set(props.name, props.value)
}

module.exports = HeaderManager
