const { Check } = require('../symbol')
const value = require('../value')
const makeResult = require('../result')

function JSONPathAssertion (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, settings)
  }
  if (!settings.name) settings.name = 'JSONPathAssertion'
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (settings.path && settings.format) {
    result.imports.add('jsonpath')
    if (settings.format === 'YAML') result.imports.add('yaml')
    if (settings.regex) result.imports.add('perl-regex')
    const logic = render(settings)
    Object.assign(result.defaults, { [Check]: {
      [settings.name]: logic
    } })
  }
  return result
}

function attribute (node, key, settings) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
      break
    case 'testname':
      settings.name = node.attributes.testname
      break
    default:
      throw new Error('Unrecognized JSONPathAssertion attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.name += ` - ${value(node, context)}`
      break
    case 'JSON_PATH':
      settings.path = value(node, context)
      break
    case 'EXPECTED_VALUE':
      settings.test = value(node, context)
      break
    case 'EXPECT_NULL':
      if (value(node, context) === 'true') settings.test = null
      break
    case 'INVERT':
      settings.negate = (value(node, context) === 'true')
      break
    case 'ISREGEX':
      settings.regex = (value(node, context) === 'true')
      break
    case 'INPUT_FORMAT': {
      const format = value(node, context)
      if (![ 'JSON', 'YAML' ].includes(format)) {
        throw new Error('Unrecognized JSONPathAssertion format: ' + format)
      }
      settings.format = format
      break
    }
    default:
      throw new Error('Unrecognized JSONPathAssertion property: ' + name)
  }
}

function render (settings) {
  const parser = settings.format === 'YAML' ? 'yaml' : 'JSON'
  return '' +
`const body = (() => {
  try { return ${parser}.parse(r.body) }
  catch { return null }
})()
if (!body) return false
const values = jsonpath.query(body, ${JSON.stringify(settings.path)})
${test(settings)}`
}

function test (settings) {
  return (
    settings.test === '[]' ? `return !values.length`
      : 'test' in settings ? `return !!(${expr(settings)})`
        : `return !!values.length`
  )
}

function expr (settings) {
  const core = `values.find(value => ${itemExpr(settings)})`
  if (settings.negate) return `!${core}`
  else return core
}

function itemExpr (settings) {
  if (settings.test === null) return 'value === null'
  else {
    const value = '(typeof value === "object" ? JSON.stringify(value) : value)'
    const test = JSON.stringify(settings.test)
    if (settings.regex) return `perlRegex.match(${value}, ${test})`
    else return `${value} === ${test}`
  }
}

module.exports = JSONPathAssertion
