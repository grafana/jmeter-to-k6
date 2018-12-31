const route = {
  ConfigTestElement: require('../element/ConfigTestElement'),
  DurationAssertion: require('../element/DurationAssertion')
}

function extractDefaults (node, defaults = []) {
  const values = {}
  const configs = node.children.filter(
    item => item.type === 'element' && item.name in route
  )
  for (const config of configs) {
    const { defaults: [ configValues ] } = route[config.name](config)
    for (const key of Object.keys(configValues)) {
      if (!(key in values)) values[key] = {}
      Object.assign(values[key], configValues[key])
    }
  }
  node.children = node.children.filter(
    item => !(item.type === 'element' && item.name === 'ConfigTestElement')
  )
  return [ ...defaults, values ]
}

module.exports = extractDefaults
