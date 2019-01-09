const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const runtimeString = require('../string/run')
const text = require('../text')
const makeResult = require('../result')

function IfController (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.logic = ''
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, settings)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  const childrenLogic = childrenResult.logic || ''
  delete childrenResult.logic
  merge(result, childrenResult)
  if (settings.condition) {
    result.logic += `

`
    if (settings.comment) {
      result.logic += `/*
${settings.comment}
*/
`
    }
    result.logic += `if (${settings.condition}) {
${ind(childrenLogic)}
}`
  }
  return result
}

function attribute (node, key) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized IfController attribute: ' + key)
  }
}

function property (node, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'evaluateAll':
    case 'useExpression':
      break
    case 'comments':
      settings.comment = text(node.children)
      break
    case 'condition':
      settings.condition = runtimeString(text(node.children))
      break
  }
}

module.exports = IfController
