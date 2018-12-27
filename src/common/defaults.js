const ConfigTestElement = require('../element/ConfigTestElement')

function extractDefaults (node, defaults = []) {
  const values = {}
  const configs = node.children.filter(
    item => item.type === 'element' && item.name === 'ConfigTestElement'
  )
  for (const config of configs) {
    const { defaults: [ configValues ] } = ConfigTestElement(config)
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
