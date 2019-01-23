module.exports = (...args) => { return element(...args) }

const extractDefaults = require('./common/defaults')
const makeContext = require('./context')
const route = {
  Arguments: require('./element/Arguments'),
  BeanShellPostProcessor: require('./element/BeanShellPostProcessor'),
  BeanShellPreProcessor: require('./element/BeanShellPreProcessor'),
  BoundaryExtractor: require('./element/BoundaryExtractor'),
  CookieManager: require('./element/CookieManager'),
  DNSCacheManager: require('./element/DNSCacheManager'),
  Fake: require('./element/Fake'),
  ForeachController: require('./element/ForeachController'),
  GenericController: require('./element/GenericController'),
  hashTree: require('./element/hashTree'),
  HTTPSamplerProxy: require('./element/HTTPSamplerProxy'),
  IfController: require('./element/IfController'),
  InterleaveControl: require('./element/InterleaveControl'),
  jmeterTestPlan: require('./element/jmeterTestPlan'),
  JSR223PostProcessor: require('./element/JSR223PostProcessor'),
  JSR223PreProcessor: require('./element/JSR223PreProcessor'),
  'kg.apc.jmeter.threads.SteppingThreadGroup':
    require('./element/SteppingThreadGroup'),
  LoopController: require('./element/LoopController'),
  OnceOnlyController: require('./element/OnceOnlyController'),
  PostThreadGroup: require('./element/PostThreadGroup'),
  RandomController: require('./element/RandomController'),
  RegexExtractor: require('./element/RegexExtractor'),
  RunTime: require('./element/RunTime'),
  SetupThreadGroup: require('./element/SetupThreadGroup'),
  TestPlan: require('./element/TestPlan'),
  ThreadGroup: require('./element/ThreadGroup'),
  TransactionController: require('./element/TransactionController'),
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
  context.defaults = extractDefaults(node, context)
  return route[name](node, context)
}
