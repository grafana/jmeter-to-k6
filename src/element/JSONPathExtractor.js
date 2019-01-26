const { Post } = require('../symbol')
const runtimeString = require('../string/run')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function JSONPathExtractor (node, context) {
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
      throw new Error('Unrecognized JSONPathExtractor attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'DEFAULT':
      settings.default = value(node, context)
      break
    case 'INPUT_FORMAT':
      settings.format = text(node.children)
      break
    case 'JSONPATH':
      settings.query = text(node.children)
      break
    case 'SUBJECT':
      settings.input = text(node.children)
      break
    case 'VAR':
      settings.output = text(node.children)
      break
    case 'VARIABLE':
      settings.inputVar = text(node.children)
      break
    default:
      throw new Error('Unrecognized JSONPathExtractor property: ' + name)
  }
}

function sufficient (settings) {
  return (
    settings.format &&
    settings.query &&
    settings.input &&
    settings.output
  )
}

function render (settings, result) {
  result.state.add('matches')
  result.state.add('output')
  result.state.add('vars')
  result.imports.set('jsonpath', './build/jsonpath.js')
  let logic = ''
  if (settings.comment) logic += `/* ${settings.comment} */\n`
  const input = renderInput(settings)
  const parse = renderParse(settings, result)
  const query = JSON.stringify(settings.query)
  const output = runtimeString(settings.output)
  const def = (settings.default ? JSON.stringify(settings.default) : '')
  logic += '' +
`{
  const serial = ${input}
  const input = (() => {
    try { return ${parse} }
    catch (e) { return null }
  })()
  matches = jsonpath.query(input, ${query})
  output = ${output}
  if (matches.length) {
    vars[output] = (matches[0] === null ? 'null' : matches[0])
  }` + (def ? ` else vars[output] = ${def}` : '') + `
  for (let i = 0; i < matches.length; i++) {
    vars[output + '_' + (i+1)] = matches[i]
  }
}`
  result.defaults.push({ [Post]: [ logic ] })
}

function renderInput (settings) {
  const { input: type } = settings
  switch (type) {
    case 'BODY': return `r.body`
    case 'VAR':
      if (!settings.inputVar) throw new Error('Missing input var name')
      return `vars[${runtimeString(settings.inputVar)}] || ''`
    default:
      throw new Error('Unrecognized JSONPathExtractor input type: ' + type)
  }
}

function renderParse (settings, result) {
  const { format } = settings
  switch (format) {
    case 'JSON': return `JSON.parse(serial)`
    case 'YAML':
      result.imports.set('yaml', './build/yaml.js')
      return `yaml.parse(serial)`
    default:
      throw new Error('Unrecognized JSONPathExtractor format: ' + format)
  }
}

module.exports = JSONPathExtractor
