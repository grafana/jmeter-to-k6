const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const strip = require('../strip')
const value = require('../value')
const makeResult = require('../result')

function GenericController (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) {
    attribute(node, settings, key)
  }
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  const childrenLogic = childrenResult.logic || ''
  delete childrenResult.logic
  merge(result, childrenResult)
  if (settings.name) render(settings, result, childrenLogic)
  else throw new Error('GenericController missing name')
  node.children = []
  return result
}

function attribute (node, settings, key) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
      break
    case 'testname':
      settings.name = node.attributes.testname
      break
    default:
      throw new Error('Unrecognized GenericController attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    default:
      throw new Error('Unrecognized GenericController property: ' + name)
  }
}

function render (settings, result, childrenLogic) {
  result.imports.set('k6', 'k6')
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  result.logic += '' +
`k6.group(${JSON.stringify(settings.name)}, () => {
${ind(strip(childrenLogic))}
})`
}

module.exports = GenericController
