const merge = require('../merge')
const elements = require('../elements')
const value = require('../value')
const makeResult = require('../result')

function ThreadGroup (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.options.stages = [ {} ]
  result.logic = ''
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els, context))
  result.user = true
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized ThreadGroup attribute: ' + key)
  }
}

function property (node, context, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'on_sample_error':
    case 'main_controller':
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break
    case 'comments': {
      const comments = value(node, context)
      result.logic += `

/* ${comments} */`
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

module.exports = ThreadGroup
