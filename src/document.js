const element = require('./element')

/**
 * Convert parsed document
 *
 * @param {object} tree - Parsed document tree.
 *
 * @return {ConvertResult}
 */
function document (tree) {
  const root = tree.children[0]
  return element(root)
}

module.exports = document
