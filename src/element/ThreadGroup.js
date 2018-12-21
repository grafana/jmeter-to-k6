const merge = require('../merge')
const elements = require('../elements')
const text = require('../text')
const makeResult = require('../result')

function ThreadGroup (node) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.options.stages = [ {} ]
  result.logic = ''
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els))
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

function property (node, result) {
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
      const comments = text(node.children)
      result.logic += `

/*
${comments}
*/`
      break
    }
    case 'num_threads': {
      const valueString = text(node.children)
      const value = Number.parseInt(valueString, 10)
      result.options.stages[0].target = value
      break
    }
    case 'ramp_time': {
      const value = text(node.children)
      result.options.stages[0].duration = value + 's'
      break
    }
    default: throw new Error('Unrecognized ThreadGroup property: ' + name)
  }
}

module.exports = ThreadGroup
