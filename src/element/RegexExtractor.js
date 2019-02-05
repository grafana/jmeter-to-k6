const { Post } = require('../symbol')
const ind = require('../ind')
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
  result.state.add('regex')
  result.state.add('matches')
  result.state.add('match')
  result.state.add('extract')
  result.state.add('output')
  result.state.add('vars')
  let logic = ''
  if (settings.comment) logic += `/* ${settings.comment} */\n`
  const regex = `new RegExp(${JSON.stringify(settings.regex)})`
  const input = renderInput(settings.component, result)
  const transport = renderTransport(settings)
  logic += '' +
`regex = ${regex}
matches = (() => {
  const matches = []
  while (match = regex.exec(${input})) matches.push(match)
  return matches
})()
${transport}`
  result.defaults.push({ [Post]: [ logic ] })
}

function renderTransport (settings) {
  if (settings.index < 0) return renderDistribute(settings)
  else {
    const select = renderSelect(settings)
    const write = renderWrite(settings)
    return `match = ${select}
${write}`
  }
}

function renderDistribute (settings) {
  const output = runtimeString(settings.output)
  const defaultValue = renderDefault(settings)
  const defaultLine = (
    defaultValue ? `\nvars[output] = ${defaultValue}` : ''
  )
  const construct = renderConstruct(settings)
  return '' +
`output = ${output}` + defaultLine + `
vars[output + '_matchNr'] = matches.length
for (let i = 0; i < matches.length; i++) {
  match = matches[i]
${ind(construct)}
  vars[output + '_' + i] = extract
  for (let j = 0; j < match.length; j++) {
    const name = output + '_' + i + '_g' + j
    vars[name] = match[j]
  }
}`
}

function renderSelect (settings) {
  const { index } = settings
  if (index > 0) return namedSelect(index)
  else return randomSelect()
}

function namedSelect (index) {
  return `(${index} >= matches.length ? null : matches[${index}])`
}

function randomSelect () {
  const index = `Math.floor(Math.random()*(matches.length-1))+1`
  const extract = `matches[${index}]`
  return `(matches.length <= 1 ? null : ${extract})`
}

function renderWrite (settings) {
  const output = runtimeString(settings.output)
  const defaultValue = renderDefault(settings)
  const defaultLine = (
    defaultValue ? `\n  vars[output] = ${defaultValue}` : ''
  )
  const construct = renderConstruct(settings)
  return '' +
`output = ${output}
if (match) {
${ind(construct)}
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {` + defaultLine + `
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`
}

function renderDefault (settings) {
  if (settings.clear) return `''`
  else if (settings.default) return JSON.stringify(settings.default)
  else return null
}

function renderConstruct (settings) {
  const regex = '/\\$(\\d*)\\$/g'
  const template = JSON.stringify(settings.template)
  return '' +
`extract = ${template}.replace(${regex}, (match, digits) => {
  if (!digits) return ''
  const index = Number.parseInt(digits, 10)
  if (index > (match.length - 1)) return ''
  return match[index]
})`
}

module.exports = RegexExtractor
