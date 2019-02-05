const { Runtime } = require('../symbol')
const elements = require('../elements')
const ind = require('../ind')
const merge = require('../merge')
const runtimeString = require('../string/run')
const strip = require('../strip')
const text = require('../text')
const value = require('../value')
const makeContext = require('../context')
const makeResult = require('../result')

function WhileController (node, context = makeContext()) {
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
  if (settings.condition) render(settings, result, context, childrenLogic)
  else throw new Error('WhileController missing condition')
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
    default: throw new Error('Unrecognized WhileController attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'condition':
      settings.condition = runtimeString(text(node.children)) + ' !== "false"'
      break
  }
}

function render (settings, result, context, childrenLogic) {
  result.logic += `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  result.logic += `{ let first = true; while (${settings.condition}) {
${ind(strip(childrenLogic))}
  first = false` +
  renderRuntime(context) + `
} }`
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

module.exports = WhileController
