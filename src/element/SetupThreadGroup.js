const merge = require('../merge')
const elements = require('../elements')
const text = require('../text')
const makeResult = require('../result')

function SetupThreadGroup (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els, context))
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized SetupThreadGroup attribute: ' + key)
  }
}

function property (node, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'num_threads':
    case 'ramp_time':
    case 'on_sample_error':
    case 'main_controller':
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break
    case 'comments': {
      const comments = text(node.children)
      result.setup += `

/* ${comments} */`
      break
    }
  }
}

module.exports = SetupThreadGroup
