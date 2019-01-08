const makeContext = require('../context')

function interpolate (string, context = makeContext()) {
  return string.replace(/\${.*}/g, match => replace(match, context))
}

function replace (match, context) {
  return evaluate(match.substring(2, match.length - 1), context)
}

function evaluate (string, context) {
  if (string === '') return ''
  else if (string.substring(0, 2) === '__') return func(string, context)
  else return variable(string, context)
}

function func (string, context) {
  throw new Error('JMeter functions not implemented')
}

function variable (name, context) {
  if (!context.vars.has(name)) throw new Error('Undefined variable: ' + name)
  return context.vars.get(name)
}

module.exports = interpolate
