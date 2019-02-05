const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function JSR223PreProcessor (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (sufficient(settings)) render(settings, result)
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
      throw new Error('Unrecognized JSR223PreProcessor attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'cacheKey':
    case 'parameters':
      break
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'filename':
      settings.path = value(node, context)
      break
    case 'script':
      settings.code = text(node.children)
      break
    case 'scriptLanguage':
      settings.language = text(node.children)
      break
    default:
      throw new Error('Unrecognized JSR223PreProcessor property: ' + name)
  }
}

function sufficient (settings) {
  return (
    settings.code ||
    settings.path
  )
}

function render (settings, result) {
  result.logic = `\n\n/* JSR223PreProcessor\n\n`
  if (settings.comment) result.logic += `${settings.comment}\n\n`
  if (settings.language) result.logic += `language: ${settings.language}\n\n`
  if (settings.path) result.logic += `file: ${settings.path}\n\n`
  else result.logic += settings.code.replace('*/', '* /') + `\n\n`
  result.logic += `*/`
}

module.exports = JSR223PreProcessor
