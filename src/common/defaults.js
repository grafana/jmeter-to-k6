const makeContext = require('../context')

const route = {
  'com.atlantbh.jmeter.plugins.jsonutils.jsonpathassertion.JSONPathAssertion':
    require('../element/JSONPathAssertion'),
  ConfigTestElement: require('../element/ConfigTestElement'),
  ConstantTimer: require('../element/ConstantTimer'),
  DurationAssertion: require('../element/DurationAssertion'),
  ResponseAssertion: require('../element/ResponseAssertion')
}

function extractDefaults (node, context = makeContext()) {
  const values = {}
  const configs = node.children.filter(
    item => item.type === 'element' && item.name in route
  )
  for (const config of configs) {
    const { defaults: [ configValues ] } = route[config.name](config, context)
    for (const key of Object.keys(configValues)) {
      if (!(key in values)) values[key] = {}
      mergeCategory(values[key], configValues[key])
    }
  }
  node.children = node.children.filter(
    item => !(item.type === 'element' && item.name in route)
  )
  return [ ...context.defaults, values ]
}

function mergeCategory (base, update) {
  for (const key of Object.keys(update)) mergeValue(base, update, key)
}

function mergeValue (base, update, key) {
  if (Array.isArray(update[key])) {
    if (!(key in base)) base[key] = []
    base[key].push(...update[key])
  } else base[key] = update[key]
}

module.exports = extractDefaults
