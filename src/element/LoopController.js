const { Runtime } = require('../symbol')
const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const strip = require('../strip')
const value = require('../value')
const makeContext = require('../context')
const makeResult = require('../result')

function LoopController (node, context = makeContext()) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  const childrenResult = elements(els, context)
  const childrenLogic = childrenResult.logic || ''
  delete childrenResult.logic
  merge(result, childrenResult)
  if (sufficient(settings)) render(settings, result, context, childrenLogic)
  else throw new Error('Invalid LoopController')
  node.children = []
  return result
}

function attribute (node, key) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized LoopController attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'continue_forever':
      settings.infinite = (value(node, context) === 'true')
      break
    case 'loops':
      settings.count = Number.parseInt(value(node, context), 10)
      break
    default: throw new Error('Unrecognized LoopController property: ' + name)
  }
}

function sufficient (settings) {
  return (
    settings.infinite ||
    'count' in settings
  )
}

function render (settings, result, context, childrenLogic) {
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  if (settings.infinite || settings.count === -1) {
    result.logic += '' +
`{ let first = true; while (true) {
${ind(strip(childrenLogic))}
  first = false` +
  renderRuntime(context) + `
} }`
  } else {
    result.logic += '' +
`for (let i = 0, first = true; i <= ${settings.count}; i++) {
${ind(strip(childrenLogic))}
  first = false` +
  renderRuntime(context) + `
}`
  }
}

function renderRuntime (context) {
  if (!runtime(context)) return ''
  return `
  if (Date.now() >= deadline) break`
}

function runtime (context) {
  for (const level of context.defaults) if (level[Runtime]) return true
  return false
}

module.exports = LoopController
