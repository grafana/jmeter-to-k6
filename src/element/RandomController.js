const element = require('../element')
const expand = require('../expand')
const ind = require('../ind')
const merge = require('../merge')
const strip = require('../strip')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function RandomController (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  const els = expand(node.children.filter(node => !/Prop$/.test(node.name))
    .filter(node => node.type === 'element')
    .map(item => item.name === 'hashTree'
      ? item.children.filter(item => item.type === 'element')
      : item
    )
  )
  render(settings, result, context, els)
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
    default:
      throw new Error('Unrecognized RandomController attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'style':
      style(node, context, settings)
      break
    default:
      throw new Error('Unrecognized RandomController property: ' + name)
  }
}

/**
 * Value is a bit field encoded as a decimal integer.
 * Bits from low order, 0 based:
 *   0  disable limit subcontroller to 1 request per iteration
 */
function style (node, context, settings) {
  const bits = Number.parseInt(text(node.children), 10)
  if (!(bits & 0b1)) {
    // limit subcontroller to 1 request per iteration
    throw new Error('Ignore subcontrollers not supported')
  }
}

function render (settings, result, context, els) {
  const children = els.map(node => element(node, context))
  const blocks = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const logic = child.logic || ''
    delete child.logic
    merge(result, child)
    blocks.push(`case ${i}:
${ind(strip(logic))}
  break`)
  }
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  const index = `Math.floor(Math.random()*(${blocks.length}))`
  result.logic += '' +
`{ const index = ${index}; switch (index) {
${ind(blocks.join('\n'))}
  default: throw new Error('Unexpected random index: ' + index)
} }`
}

module.exports = RandomController
