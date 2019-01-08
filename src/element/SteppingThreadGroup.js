const elements = require('../elements')
const merge = require('../merge')
const text = require('../text')
const makeResult = require('../result')

function SteppingThreadGroup (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.options.stages = []
  result.logic = ''
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  const spec = {}
  for (const prop of props) property(prop, result, spec)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els, context))
  if (spec.total && spec.step && spec.interval) {
    const { total, step, interval } = spec
    const group = []
    if (total < step) throw new Error('Invalid total threads')
    const count = Math.ceil(total / step)
    for (let i = count - 1; i > 0; i--) {
      const stage = { target: step, duration: interval + 'ms' }
      group.push(stage)
    }
    const remainder = total - (step * (count - 1))
    const stage = { target: remainder, duration: interval + 'ms' }
    group.push(stage)
    result.options.stages.push(group)
  }
  result.user = true
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error(
      'Unrecognized SteppingThreadGroup attribute: ' + key
    )
  }
}

function property (node, result, spec) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'on_sample_error':
    case 'Threads initial delay':
    case 'Stop users count':
    case 'Stop users period':
    case 'flighttime':
    case 'main_controller':
    case 'rampUp':
      break
    case 'comments': {
      const comments = text(node.children)
      result.prolog += `

/*
${comments}
*/`
      break
    }
    case 'num_threads':
      spec.total = Number.parseInt(text(node.children), 10)
      break
    case 'Start users count':
      spec.step = Number.parseInt(text(node.children), 10)
      break
    case 'Start users period':
      spec.interval = text(node.children)
      break
    default: throw new Error(
      'Unrecognized SteppingThreadGroup property: ' + name
    )
  }
}

module.exports = SteppingThreadGroup
