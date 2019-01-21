const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const value = require('../value')
const makeResult = require('../result')

function ForeachController (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = { separator: '' }
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  const childrenLogic = childrenResult.logic || ''
  delete childrenResult.logic
  merge(result, childrenResult)
  if (sufficient(settings)) render(settings, result, childrenLogic)
  else throw new Error('Invalid ForeachController')
  return result
}

function attribute (node, key) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default:
      throw new Error('Unrecognized ForeachController attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'endIndex':
      settings.end = Number.parseInt(value(node, context), 10)
      break
    case 'inputVal':
      settings.input = value(node, context)
      break
    case 'returnVal':
      settings.output = value(node, context)
      break
    case 'startIndex':
      settings.start = Number.parseInt(value(node, context), 10)
      break
    case 'useSeparator': {
      const separator = (value(node, context) === 'true')
      if (separator) settings.separator = '_'
      break
    }
  }
}

function sufficient (settings) {
  return (
    'end' in settings &&
    'start' in settings &&
    settings.input &&
    settings.output
  )
}

function render (settings, result, childrenLogic) {
  result.logic = `

`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  const components = []
  components.push(JSON.stringify(settings.input + settings.separator))
  components.push(`i`)
  const input = `vars[${components.join(' + ')}]`
  const output = `vars[${JSON.stringify(settings.output)}]`
  result.logic += '' +
`for (let i = ${settings.start}; i <= ${settings.end}; i++) {
  ${output} = ${input}
${ind(childrenLogic)}
}`
}

module.exports = ForeachController
