const { Post } = require('../symbol')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function ResultAction (node, context) {
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
      throw new Error(
        'Unrecognized ResultStatusActionHandler attribute: ' + key
      )
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'action':
      settings.action = Number.parseInt(text(node.children), 10)
      break
    default:
      throw new Error(
        'Unrecognized ResultStatusActionHandler property: ' + name
      )
  }
}

function sufficient (settings) {
  return ('action' in settings)
}

function render (settings, result) {
  const action = renderAction(settings, result)
  const logic = `if (Math.floor(r.status/100) !== 2) ${action}`
  result.defaults.push({ [Post]: [ logic ] })
}

function renderAction (settings, result) {
  const { action } = settings
  switch (action) {
    case 0: return `{}` // Ignore
    case 1: // Stop thread
    case 2: // Stop test
    case 3: // Stop test now
    case 4: // Continue thread, not supported
      result.imports.set('k6', 'k6')
      return `k6.fail('Request failed: ' + r.status)`
    case 5: return `continue` // Continue loop
    case 6: return `break` // Break loop
    default:
      throw new Error(
        'Unrecognized ResultStatusActionHandler action: ' + action
      )
  }
}

module.exports = ResultAction
