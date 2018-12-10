const jmeterTestPlan = require('./element/jmeterTestPlan')

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node) {
  switch (node.name) {
    case 'jmeterTestPlan': return jmeterTestPlan(node)
    default: throw new Error('Unrecognized element: ' + node.name)
  }
}

module.exports = element
