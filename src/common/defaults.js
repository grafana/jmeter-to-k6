const makeContext = require('../context')

const route = {
  AuthManager: require('../element/AuthManager'),
  'com.atlantbh.jmeter.plugins.jsonutils.jsonpathassertion.JSONPathAssertion':
    require('../element/JSONPathAssertion'),
  ConfigTestElement: require('../element/ConfigTestElement'),
  ConstantTimer: require('../element/ConstantTimer'),
  DurationAssertion: require('../element/DurationAssertion'),
  HeaderManager: require('../element/HeaderManager'),
  ResponseAssertion: require('../element/ResponseAssertion'),
  ResultStatusActionHandler: require('../element/ResultStatusActionHandler')
}

function extractDefaults (node, context = makeContext()) {
  const values = {}
  const configs = node.children.filter(
    item => item.type === 'element' && item.name in route
  )
  for (const config of configs) {
    const { defaults: [ configValues ] } = route[config.name](config, context)
    for (const key of [
      ...Object.keys(configValues),
      ...Object.getOwnPropertySymbols(configValues)
    ]) mergeCategory(values, configValues, key)
  }
  node.children = node.children.filter(
    item => !(item.type === 'element' && item.name in route)
  )
  return [ ...context.defaults, values ]
}

function mergeCategory (base, update, key) {
  if (Array.isArray(update[key])) mergeArray(base, update, key)
  else if (update[key] instanceof Map) mergeMap(base, update, key)
  else mergeObject(base, update, key)
}

function mergeArray (base, update, key) {
  if (!(key in base)) base[key] = []
  base[key].push(...update[key])
}

function mergeMap (base, update, key) {
  if (!(key in base)) base[key] = new Map()
  for (const [ name, value ] of update[key]) base[key].set(name, value)
}

function mergeObject (base, update, key) {
  if (!(key in base)) base[key] = {}
  for (const key of Object.keys(update)) mergeValue(base, update, key)
}

function mergeValue (base, update, key) {
  if (Array.isArray(update[key])) {
    if (!(key in base)) base[key] = []
    base[key].push(...update[key])
  } else base[key] = update[key]
}

module.exports = extractDefaults
