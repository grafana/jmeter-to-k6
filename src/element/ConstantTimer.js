const { Delay } = require('../symbol')
const text = require('../text')
const makeResult = require('../result')

function ConstantTimer (node) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, settings)
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

function property (node, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = text(node.children)
      break
    case 'delay':
      settings.delay = Number.parseInt(text(node.children), 10)
      break
    default: throw new Error('Unrecognized ConstantTimer property: ' + name)
  }
}

module.exports = ConstantTimer
