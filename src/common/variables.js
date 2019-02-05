const makeContext = require('../context')
const merge = require('../merge')
const variable = require('./variable')

/**
 * Convert variables collection
 *
 * @param {object} node - Parsed variables collection node.
 *
 * @return {ConvertResult}
 */
function variables (node, context = makeContext()) {
  const result = { vars: new Map() }
  const items = node.children.filter(item => item.type === 'element')
  for (const item of items) {
    const itemResult = variable(item, context)
    merge(result, itemResult)
  }
  return result
}

module.exports = variables
