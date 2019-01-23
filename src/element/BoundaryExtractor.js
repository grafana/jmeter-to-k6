const runtimeString = require('../string/run')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function BoundaryExtractor (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = { component: 'false' }
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
      throw new Error('Unrecognized BoundaryExtractor attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'default':
      settings.default = value(node, context)
      break
    case 'default_empty_value':
      settings.clear = (text(node.children) === 'true')
      break
    case 'lboundary':
      settings.left = value(node, context)
      break
    case 'match_number':
      settings.index = Number.parseInt(text(node.children), 10)
      break
    case 'rboundary':
      settings.right = value(node, context)
      break
    case 'refname':
      settings.output = text(node.children)
      break
    case 'scope':
      settings.samples = text(node.children)
      break
    case 'useHeaders':
      settings.component = text(node.children)
      break
    default:
      throw new Error('Unrecognized BoundaryExtractor property: ' + name)
  }
}

function sufficient (settings) {
  return (
    'left' in settings &&
    'index' in settings &&
    'right' in settings &&
    'output' in settings &&
    'component' in settings
  )
}

function render (settings, result) {
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  const left = JSON.stringify(escape(settings.left))
  const right = JSON.stringify(escape(settings.right))
  const regex = `new RegExp(${left} + '(.*)' + ${right}, 'g')`
  const input = renderInput(settings, result)
  const transport = renderTransport(settings)
  result.logic += '' +
`regex = ${regex}
matches = regex.exec(${input})
${transport}`
}

function escape (string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function renderInput (settings, result) {
  const { component } = settings
  switch (component) {
    case 'as_document': throw new Error('Apache Tika extraction not supported')
    case 'code': return `r.status` // Response status code
    case 'false': return `r.body` // Request body
    case 'message':
      // Response status message
      throw new Error('Response status message not accessible')
    case 'request_headers': return `r.request.headers` // Request headers
    case 'true': return `r.headers` // Response headers
    case 'unescaped':
      // Request body with HTML entities decoded
      result.imports.set('he', 'he')
      return `he.decode(r.body)`
    case 'URL': return `r.request.url` // Request address
    default:
      throw new Error('Unrecognized BoundaryExtractor input: ' + component)
  }
}

function renderTransport (settings) {
  if (settings.index < 0) return renderDistribute(settings)
  else {
    const extract = renderExtract(settings)
    const write = renderWrite(settings)
    return `extract = ${extract}
${write}`
  }
}

function renderDistribute (settings) {
  const output = runtimeString(settings.output)
  const defaultValue = renderDefault(settings)
  const components = []
  if (defaultValue) components.push(`vars[${output}] = ${defaultValue}`)
  components.push(`vars[${output} + '_matchNr'] = matches.length - 1`)
  components.push('' +
`for (let i = (matches.length - 1); i > 0; i--) {
  vars[${output} + '_' + i] = matches[i]
}`)
  return components.join('\n')
}

function renderExtract (settings) {
  const { index } = settings
  if (index > 0) return namedExtract(index)
  else return randomExtract()
}

function namedExtract (index) {
  return `(${index} >= matches.length ? null : matches[${index}])`
}

function randomExtract () {
  const index = `Math.floor(Math.random()*(matches.length-1))+1`
  const extract = `matches[${index}]`
  return `(matches.length <= 1 ? null : ${extract})`
}

function renderWrite (settings) {
  const output = runtimeString(settings.output)
  const defaultValue = renderDefault(settings)
  if (defaultValue) return `vars[${output}] = extract || ${defaultValue}`
  else return `if (extract) vars[${output}] = extract`
}

function renderDefault (settings) {
  if (settings.clear) return `''`
  else if (settings.default) return JSON.stringify(settings.default)
  else return null
}

module.exports = BoundaryExtractor
