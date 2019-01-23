const renderInput = require('../common/input')
const runtimeString = require('../string/run')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function RegexExtractor (node, context) {
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
      throw new Error('Unrecognized RegexExtractor attribute: ' + key)
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
    case 'match_number':
      settings.index = Number.parseInt(text(node.children), 10)
      break
    case 'regex':
      settings.regex = text(node.children)
      break
    case 'refname':
      settings.output = text(node.children)
      break
    case 'scope':
      settings.scope = text(node.children)
      break
    case 'template':
      settings.template = text(node.children)
      break
    case 'useHeaders':
      settings.component = text(node.children)
      break
  }
}

function sufficient (settings) {
  return (
    'index' in settings &&
    settings.regex &&
    settings.output &&
    settings.component &&
    settings.template
  )
}

function render (settings, result) {
  result.imports.set('perlRegex', 'perl-regex')
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  const regex = JSON.stringify(settings.regex)
  const input = renderInput(settings.component, result)
  const transport = renderTransport(settings)
  result.logic += '' +
`match = (() => {
  const match = perlRegex.exec(${input}, ${regex}, 'g')
  if (!match) return []

})()
${transport}`
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
  components.push(`vars`)
  throw new Error('Not yet implemented')
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

module.exports = RegexExtractor
