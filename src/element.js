module.exports = (...args) => { return element(...args) }

const extractDefaults = require('./common/defaults')
const makeContext = require('./context')
const makeResult = require('./result')
const merge = require('./merge')
const route = {
  Arguments: require('./element/Arguments'),
  BeanShellPostProcessor: require('./element/BeanShellPostProcessor'),
  BeanShellPreProcessor: require('./element/BeanShellPreProcessor'),
  CookieManager: require('./element/CookieManager'),
  CSVDataSet: require('./element/CSVDataSet'),
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
  RunTime: require('./element/RunTime'),
  SetupThreadGroup: require('./element/SetupThreadGroup'),
  TestPlan: require('./element/TestPlan'),
  ThreadGroup: require('./element/ThreadGroup'),
  TransactionController: require('./element/TransactionController'),
  WhileController: require('./element/WhileController'),
  XPath2Extractor: require('./element/XPath2Extractor'),
  XPathAssertion: require('./element/XPathAssertion'),
  XPathExtractor: require('./element/XPathExtractor')
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
  const result = makeResult()
  context.defaults = extractDefaults(node, result, context)
  const elementResult = route[name](node, context)
  merge(result, elementResult)
  return result
}
