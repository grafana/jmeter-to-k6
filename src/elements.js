module.exports = (...args) => { return elements(...args) }

const merge = require('./merge')
const element = require('./element')
const makeResult = require('./result')

/**
 * Convert child elements
 *
 * @param {Iterable<object>} nodes - Parsed nodes. 0+ items.
 *
 * @return {ConvertResult}
 */
function elements (nodes) {
  const result = makeResult()
  nodes = nodes.filter(node => node.type === 'element')
  for (const node of nodes) merge(result, element(node))
  return result
}
