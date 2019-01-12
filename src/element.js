module.exports = (...args) => { return element(...args) }

const extractDefaults = require('./common/defaults')
const makeContext = require('./context')
const route = {
  Arguments: require('./element/Arguments'),
  AuthManager: require('./element/AuthManager'),
  CookieManager: require('./element/CookieManager'),
  DNSCacheManager: require('./element/DNSCacheManager'),
  Fake: require('./element/Fake'),
  hashTree: require('./element/hashTree'),
  HeaderManager: require('./element/HeaderManager'),
  IfController: require('./element/IfController'),
  jmeterTestPlan: require('./element/jmeterTestPlan'),
  'kg.apc.jmeter.threads.SteppingThreadGroup':
    require('./element/SteppingThreadGroup'),
  PostThreadGroup: require('./element/PostThreadGroup'),
  SetupThreadGroup: require('./element/SetupThreadGroup'),
  TestPlan: require('./element/TestPlan'),
  ThreadGroup: require('./element/ThreadGroup'),
  WhileController: require('./element/WhileController'),
  XPathAssertion: require('./element/XPathAssertion')
}

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node, context = makeContext()) {
  const { name } = node
  if (!route[name]) throw new Error('Unrecognized element: ' + name)
  context.defaults = extractDefaults(node, context.defaults)
  return route[name](node, context)
}
