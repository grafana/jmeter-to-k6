module.exports = (...args) => { return properties(...args) }

const property = require('./property')

function properties (node) {
  const props = node.children.filter(
    item => item.type === 'element' && item.name.endsWith('Prop')
  )
  const result = {}
  for (const prop of props) {
    const propResult = property(prop)
    Object.assign(result, propResult)
  }
  return result
}
