const { Check } = require('../symbol')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function ResponseAssertion (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, settings)
  }
  if (!settings.name) settings.name = 'ResponseAssertion'
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (settings.tests && 'regex' in settings && settings.operand) {
    check(settings, result)
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
      throw new Error('Unrecognized ResponseAssertion attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'custom_message':
    case 'assume_success':
      break
    case 'comments':
      settings.name += ` - ${value(node, context)}`
      break
    case 'test_field':
      settings.operand = operand(node, context)
      break
    case 'test_type':
      operation(node, context, settings)
      break
    case 'test_strings':
      settings.tests = tests(node)
      break
    default:
      throw new Error('Unrecognized ResponseAssertion property: ' + name)
  }
}

function operand (node, context, settings) {
  const name = value(node, context).split('.').pop()
  switch (name) {
    case 'request_data': return 'r.request.body' // Request body
    case 'request_headers': return 'r.request.headers' // Request headers
    case 'response_code': return 'r.status' // Response status code
    case 'response_data': return 'r.body' // Response body
    case 'response_headers': return 'r.headers' // Response headers
    case 'sample_label': return 'r.request.url' // Request address
    case 'response_message':
      // Response status message
      throw new Error('Response status message not accessible')
    case 'response_data_as_document':
      throw new Error('Apache Tika extraction not supported')
    default: throw new Error('Unrecognized operand type: ' + name)
  }
}

/*
 * Value is a bit field encoded as a decimal integer.
 * Bits from low order, 0 based:
 *   0  matches
 *   1  contains
 *   2  not
 *   3  equals
 *   4  substring
 *   5  or
 */
function operation (node, context, settings) {
  const bits = Number.parseInt(text(node.children), 10)
  if (bits & 0b100) settings.negate = true
  if (bits & 0b100000) settings.disjunction = true
  if (bits & 0b1) {
    // matches
    settings.regex = true
    settings.complete = true
  } else if (bits & 0b10) {
    // contains
    settings.regex = true
    settings.complete = false
  } else if (bits & 0b1000) {
    // equals
    settings.regex = false
    settings.complete = true
  } else if (bits & 0b10000) {
    // substring
    settings.regex = false
    settings.complete = false
  } else throw new Error('Unrecognized operation spec: ' + bits)
}

function tests (node) {
  const entries = node.children.filter(node => /Prop$/.test(node.name))
  return entries.map(entry => text(entry.children))
}

function check (settings, result) {
  if (settings.regex) result.imports.set('perlRegex', './build/perl-regex.js')
  const expressions = []
  for (const test of settings.tests) expressions.push(expr(test, settings))
  const composite = expressions.join(settings.disjunction ? ' || ' : ' && ')
  const logic =
    'return ' +
    (settings.negate ? '!' : '') +
    '(' + composite + ')'
  result.defaults.push({ [Check]: { [settings.name]: logic } })
}

function expr (test, settings) {
  if (settings.regex) return regex(test, settings)
  else return string(test, settings)
}

function regex (test, settings) {
  const modifiers = (settings.complete ? 's' : 'm')
  if (/headers$/.test(settings.operand)) {
    return (
      `Object.values(${settings.operand})` +
      `.find(value => perlRegex.match(value` +
      `, ${JSON.stringify(test)}` +
      `, ${JSON.stringify(modifiers)}))`
    )
  } else {
    return (
      `perlRegex.match(${settings.operand}` +
      `, ${JSON.stringify(test)}` +
      `, ${JSON.stringify(modifiers)})`
    )
  }
}

function string (test, settings) {
  if (settings.complete) return completeString(test, settings)
  else return partialString(test, settings)
}

function completeString (test, settings) {
  if (/headers$/.test(settings.operand)) {
    return (
      `Object.values(${settings.operand})` +
      `.includes(${JSON.stringify(test)})`
    )
  } else return `${settings.operand} === ${JSON.stringify(test)}`
}

function partialString (test, settings) {
  if (/headers$/.test(settings.operand)) {
    return (
      `Object.values(${settings.operand})` +
      `.find(value => value.includes(${JSON.stringify(test)}))`
    )
  } else return `${settings.operand}.includes(${JSON.stringify(test)})`
}

module.exports = ResponseAssertion
