module.exports = (...args) => { return element(...args) }

const extractDefaults = require('./common/defaults')
const route = {
  AuthManager: require('./element/AuthManager'),
  CookieManager: require('./element/CookieManager'),
  DNSCacheManager: require('./element/DNSCacheManager'),
  Fake: require('./element/Fake'),
  hashTree: require('./element/hashTree'),
  HeaderManager: require('./element/HeaderManager'),
  jmeterTestPlan: require('./element/jmeterTestPlan'),
  'kg.apc.jmeter.threads.SteppingThreadGroup':
    require('./element/SteppingThreadGroup'),
  PostThreadGroup: require('./element/PostThreadGroup'),
  SetupThreadGroup: require('./element/SetupThreadGroup'),
  TestPlan: require('./element/TestPlan'),
  ThreadGroup: require('./element/ThreadGroup'),
  XPathAssertion: require('./element/XPathAssertion')
}

/**
 * Convert element
 *
 * @param {object} node - Parsed element.
 *
 * @return {ConvertResult}
 */
function element (node, defaults = []) {
  const { name } = node
  if (!route[name]) throw new Error('Unrecognized element: ' + name)
  defaults = extractDefaults(node, defaults)
  return route[name](node, defaults)
}
