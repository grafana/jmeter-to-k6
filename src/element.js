module.exports = (...args) => { return element(...args) }

const Fake = require('./element/Fake')
const hashTree = require('./element/hashTree')
const jmeterTestPlan = require('./element/jmeterTestPlan')
const SetupThreadGroup = require('./element/SetupThreadGroup')
const TestPlan = require('./element/TestPlan')
const ThreadGroup = require('./element/ThreadGroup')

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node) {
  switch (node.name) {
    case 'Fake': return Fake(node)
    case 'hashTree': return hashTree(node)
    case 'jmeterTestPlan': return jmeterTestPlan(node)
    case 'SetupThreadGroup': return SetupThreadGroup(node)
    case 'TestPlan': return TestPlan(node)
    case 'ThreadGroup': return ThreadGroup(node)
    default: throw new Error('Unrecognized element: ' + node.name)
  }
}
