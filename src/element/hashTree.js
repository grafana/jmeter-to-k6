const elements = require('../elements')

function hashTree (node, defaults = []) {
  return elements(node.children, defaults)
}

module.exports = hashTree
