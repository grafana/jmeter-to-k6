const text = require('../text')

/**
 * Convert variable
 *
 * @param {object} node - Parsed variable node.
 *
 * @return {ConvertResult}
 */
function variable (node) {
  const properties = node.children.filter(item => item.name === 'stringProp')
  const name = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'name'
  })
  if (!name) throw new Error('Variable missing name')
  const value = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'value'
  })
  if (!value) throw new Error('Variable missing value')
  const description = properties.find(item => {
    return item.attributes.name.split('.').pop() === 'desc'
  })
  const result = { vars: new Map() }
  const spec = { value: text(value.children) }
  if (description) spec.comment = text(description.children)
  result.vars.set(text(name.children), spec)
  return result
}

module.exports = variable
