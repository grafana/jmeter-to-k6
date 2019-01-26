const merge = require('../merge')
const elements = require('../elements')
const ind = require('../ind')
const strip = require('../strip')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function ThreadGroup (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.options.stages = [ {} ]
  result.logic = ''
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings, result)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  if (infinite(settings)) merge(result, elements(els, context))
  else {
    const childrenResult = elements(els, context)
    const childrenLogic = childrenResult.logic || ''
    delete childrenResult.logic
    merge(result, childrenResult)
    result.logic += '' +
`if (__ITER < ${settings.iterations}) {
${ind(strip(childrenLogic))}
}`
  }
  result.user = true
  return result
}

function infinite (settings) {
  return (
    !('infinite' in settings || 'iterations' in settings) ||
    settings.infinite ||
    settings.iterations < 0
  )
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized ThreadGroup attribute: ' + key)
  }
}

function property (node, context, settings, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'on_sample_error':
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break
    case 'comments': {
      const comments = value(node, context)
      result.logic += `\n\n/* ${comments} */`
      break
    }
    case 'main_controller': {
      const props = node.children.filter(node => /Prop$/.test(node.name))
      for (const prop of props) iterations(prop, context, settings, result)
      break
    }
    case 'num_threads': {
      const valueString = value(node, context)
      const valueParsed = Number.parseInt(valueString, 10)
      result.options.stages[0].target = valueParsed
      break
    }
    case 'ramp_time': {
      const valueString = value(node, context)
      result.options.stages[0].duration = valueString + 's'
      break
    }
    default: throw new Error('Unrecognized ThreadGroup property: ' + name)
  }
}

function iterations (node, context, settings, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'continue_forever':
      settings.infinite = (value(node, context) === 'true')
      break
    case 'loops':
      settings.iterations = Number.parseInt(text(node.children), 10)
      break
    default:
      throw new Error('Unrecognized ThreadGroup iteration property: ' + name)
  }
}

module.exports = ThreadGroup
