const { Post } = require('../symbol')
const ind = require('../ind')
const runtimeString = require('../string/run')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function JSONPostProcessor (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = { index: 0 }
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
      throw new Error('Unrecognized JSONPostProcessor attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'scope':
      break
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'compute_concat':
      settings.combined = (text(node.children) === 'true')
      break
    case 'defaultValues':
      settings.defaults = value(node, context).split(';')
      break
    case 'referenceNames':
      settings.outputs = text(node.children).split(';')
        .map(output => runtimeString(output))
      break
    case 'jsonPathExprs':
      settings.codes = value(node, context).split(';')
      break
    case 'match_numbers':
      settings.index = Number.parseInt(value(node, context), 10)
      break
  }
}

function sufficient (settings) {
  if (!(settings.codes && settings.codes.length)) return false
  const count = settings.codes.length
  return (
    settings.outputs && settings.outputs.length === count &&
    'index' in settings &&
    (
      !settings.defaults ||
      settings.defaults.length === count
    )
  )
}

function render (settings, result) {
  result.state.add('matches')
  result.state.add('extract')
  result.state.add('vars')
  const defs = settings.defaults
  result.imports.set('jsonpath', './libs/jsonpath.js')
  let logic = ''
  if (settings.comment) logic += `/* ${settings.comment} */\n`
  const transport = renderTransport(settings, result)
  const combine = renderCombine(settings)
  logic += '' +
`{
  const queries = ${JSON.stringify(settings.codes)}
  const outputs = ${`[${settings.outputs.join(',')}]`}` +
  (defs ? `\n  const defaults = ${JSON.stringify(defs)}` : '') + `
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]` +
      (defs ? `\n      const defaultValue = defaults[i]` : '') + `
      matches = jsonpath.query(body, query)
${ind(ind(ind(transport)))}` +
      (combine ? `\n      ${combine}` : '') + `
    }
  }` + (defs ? allDefault() : '') + `
}`
  result.defaults.push({ [Post]: [ logic ] })
}

function allDefault () {
  return ` else defaults.forEach((value, i) => { vars[outputs[i]] = value })`
}

function renderTransport (settings, result) {
  if (settings.index < 0) return renderDistribute(settings, result)
  else {
    const extract = renderExtract(settings)
    const write = renderWrite(settings)
    return `extract = ${extract}
${write}`
  }
}

function renderDistribute (settings, result) {
  result.state.add('match')
  const def = settings.defaults
  return `for (let j = 0; j < matches.length; j++) {
  match = matches[j]
  vars[output + '_' + (j+1)] = match
}` + (def ? `\nif (!matches.length) vars[output] = defaultValue` : '')
}

function renderExtract (settings) {
  const { index } = settings
  if (index > 0) return namedExtract(index)
  else return randomExtract()
}

function namedExtract (index) {
  return `(${index} > matches.length ? null : matches[${index - 1}])`
}

function randomExtract () {
  const index = `Math.floor(Math.random()*matches.length)`
  const extract = `matches[${index}]`
  return `(matches.length === 0 ? null : ${extract})`
}

function renderWrite (settings) {
  const defaultValue = settings.defaults
  if (defaultValue) return `vars[output] = extract || defaultValue`
  else return `if (extract) vars[output] = extract`
}

function renderCombine (settings) {
  if (!settings.combined) return ''
  return `vars[output + '_ALL'] = matches.join(',')`
}

module.exports = JSONPostProcessor
