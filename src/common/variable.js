const makeContext = require('../context')
const text = require('../text')

/**
 * Convert variable
 *
 * @param {object} node - Parsed variable node.
 *
 * @return {ConvertResult}
 */
function variable (node, context = makeContext()) {
  const properties = node.children.filter(item => item.name === 'stringProp')
  const nameNode = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'name'
  })
  if (!nameNode) {throw new Error('Variable missing name')}
  const valueNode = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'value'
  })
  if (!valueNode) {throw new Error('Variable missing value')}
  const description = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'desc'
  })
  const result = { vars: new Map() }
  const spec = { value: text(valueNode.children) }
  if (description) {spec.comment = text(description.children)}
  const name = text(nameNode.children)
  result.vars.set(name, spec)
  context.vars.set(name, spec.value)
  return result
}

module.exports = variable
