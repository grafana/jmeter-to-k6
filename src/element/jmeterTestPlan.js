const elements = require('../elements');

function jmeterTestPlan(node, context) {
  return elements(node.children, context);
}

module.exports = jmeterTestPlan;
