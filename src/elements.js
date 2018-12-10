const merge = require('./merge')
const element = require('./element')

/**
 * Convert child elements
 *
 * @param {Iterable<object>} nodes - Parsed nodes. 0+ items.
 *
 * @return {ConvertResult}
 */
function elements (nodes) {
  const result = { options: {}, imports: new Set(), logic: '' }
  nodes = nodes.filter(node => node.type === 'element')
  for (const node of nodes) merge(result, element(node))
  return result
}

module.exports = elements
