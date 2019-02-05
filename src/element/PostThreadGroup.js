const { Post } = require('../symbol')
const ind = require('../ind')
const strip = require('../strip')
const merge = require('../merge')
const elements = require('../elements')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function PostThreadGroup (node, context) {
  const result = makeResult()
  const settings = {}
  if (node.attributes.enabled === 'false') return result
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  if (infinite(settings)) {
    if (childrenResult.logic) {
      childrenResult.teardown += childrenResult.logic
      delete childrenResult.logic
    }
    merge(result, childrenResult)
  } else {
    const childrenLogic = childrenResult.logic || ''
    delete childrenResult.logic
    merge(result, childrenResult)
    result.teardown += '' +
`if (__ITER < ${settings.iterations}) {
${ind(strip(childrenLogic))}
}`
  }
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
    default: throw new Error('Unrecognized PostThreadGroup attribute: ' + key)
  }
}

function property (node, context, settings, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'num_threads':
    case 'ramp_time':
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break
    case 'comments': {
      const comments = value(node, context)
      result.teardown += `\n\n/* ${comments} */`
      break
    }
    case 'main_controller': {
      const props = node.children.filter(node => /Prop$/.test(node.name))
      for (const prop of props) iterations(prop, context, settings, result)
      break
    }
    case 'on_sample_error':
      errorResponse(node, result)
      break
  }
}

function errorResponse (node, result) {
  const action = renderAction(text(node.children), result)
  const logic = `if (Math.floor(r.status/100) !== 2) ${action}`
  result.defaults.push({ [Post]: [ logic ] })
}

function renderAction (action, result) {
  switch (action) {
    case 'continue': return `{}` // Ignore
    case 'startnextloop': return `continue` // Continue loop
    case 'stopthread': // Stop thread
    case 'stoptest': // Stop test
    case 'stoptestnow': // Stop test now
      result.imports.set('fail', { base: 'k6' })
      return `fail('Request failed: ' + r.status)`
    default: throw new Error('Unrecognized sampler error response: ' + action)
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

module.exports = PostThreadGroup
