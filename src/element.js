module.exports = (...args) => { return element(...args) }

const extractDefaults = require('./common/defaults')
const Fake = require('./element/Fake')
const hashTree = require('./element/hashTree')
const jmeterTestPlan = require('./element/jmeterTestPlan')
const PostThreadGroup = require('./element/PostThreadGroup')
const SetupThreadGroup = require('./element/SetupThreadGroup')
const SteppingThreadGroup = require('./element/SteppingThreadGroup')
const TestPlan = require('./element/TestPlan')
const ThreadGroup = require('./element/ThreadGroup')

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node, defaults = []) {
  defaults = extractDefaults(node, defaults)
  switch (node.name) {
    case 'Fake': return Fake(node, defaults)
    case 'hashTree': return hashTree(node, defaults)
    case 'jmeterTestPlan': return jmeterTestPlan(node, defaults)
    case 'kg.apc.jmeter.threads.SteppingThreadGroup':
      return SteppingThreadGroup(node, defaults)
    case 'PostThreadGroup': return PostThreadGroup(node, defaults)
    case 'SetupThreadGroup': return SetupThreadGroup(node, defaults)
    case 'TestPlan': return TestPlan(node, defaults)
    case 'ThreadGroup': return ThreadGroup(node, defaults)
    default: throw new Error('Unrecognized element: ' + node.name)
  }
}
