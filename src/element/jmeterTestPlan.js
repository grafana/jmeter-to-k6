const elements = require('../elements')

function jmeterTestPlan (node) {
  return elements(node.children)
}

module.exports = jmeterTestPlan
