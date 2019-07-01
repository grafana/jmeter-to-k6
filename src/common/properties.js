module.exports = (...args) => { return properties(...args) }

const makeContext = require('../context')
const property = require('./property')

function properties (node, context = makeContext(), raw = false) {
  const props = node.children.filter(
    item => item.type === 'element' && item.name.endsWith('Prop')
  )
  const result = {}
  for (const prop of props) {
    const propResult = property(prop, context, raw)
    Object.assign(result, propResult)
  }
  return result
}
