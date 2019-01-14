const { Check } = require('../symbol')
const value = require('../value')
const makeResult = require('../result')

function DurationAssertion (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, settings)
  }
  if (!settings.name) settings.name = 'DurationAssertion'
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (settings.logic) {
    Object.assign(result.defaults, { [Check]: {
      [settings.name]: settings.logic
    } })
  }
  return result
}

function attribute (node, key, settings) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
      break
    case 'testname':
      settings.name = node.attributes.testname
      break
    default:
      throw new Error('Unrecognized DurationAssertion attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.name += ` - ${value(node, context)}`
      break
    case 'duration': {
      const duration = Number.parseInt(value(node, context), 10)
      settings.logic = 'return (r.timings.duration <= ' + duration + ')'
      break
    }
    default:
      throw new Error('Unrecognized DurationAssertion property: ' + name)
  }
}

module.exports = DurationAssertion
