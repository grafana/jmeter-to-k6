const elements = require('../elements')

function jmeterTestPlan (node, defaults = []) {
  return elements(node.children, defaults)
}

module.exports = jmeterTestPlan
