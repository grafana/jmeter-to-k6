const elements = require('../elements')

function hashTree (node) {
  return elements(node.children)
}

module.exports = hashTree
