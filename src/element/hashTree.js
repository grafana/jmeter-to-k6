const elements = require('../elements');

function hashTree(node, context) {
  return elements(node.children, context);
}

module.exports = hashTree;
