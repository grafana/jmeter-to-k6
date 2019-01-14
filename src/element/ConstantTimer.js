const { Delay } = require('../symbol')
const value = require('../value')
const makeResult = require('../result')

function ConstantTimer (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if ('delay' in settings) {
    result.defaults.push({ [Delay]: [ settings ] })
  }
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized ConstantTimer attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'delay':
      settings.delay = Number.parseInt(value(node, context), 10)
      break
    default: throw new Error('Unrecognized ConstantTimer property: ' + name)
  }
}

module.exports = ConstantTimer
