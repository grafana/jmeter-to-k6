const code = require('../string/code')
const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const runtimeString = require('../string/run')
const strip = require('../strip')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function IfController (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.logic = ''
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  const childrenLogic = childrenResult.logic || ''
  delete childrenResult.logic
  merge(result, childrenResult)
  if (settings.condition) {
    const condition =
      settings.expression ? `${runtimeString(settings.condition)} === 'true'`
        : code(settings.condition)
    result.logic += `

`
    if (settings.comment) {
      result.logic += `/* ${settings.comment} */
`
    }
    result.logic += `if (${condition}) {
${ind(strip(childrenLogic))}
}`
  } else throw new Error('IfController missing condition')
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

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'evaluateAll':
      break
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'condition':
      settings.condition = text(node.children)
      break
    case 'useExpression':
      settings.expression = (value(node, context) === 'true')
      break
    default: throw new Error('Unrecognized IfController property: ' + name)
  }
}

module.exports = IfController
