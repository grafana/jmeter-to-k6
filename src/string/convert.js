const interpolate = require('./interpolate')

const find = /(?:^|\\\\|[^\\])\${.*}/

// Evaluate convert time string
function string (value, context) {
  if (find.test(value)) return unescape(interpolate(value, context))
  else return value
}

function unescape (string) {
  return string.replace(/\\[\\$,]/g, literal)
}

function literal (sequence) {
  switch (sequence) {
    case '\\\\': return '\\'
    case '\\$': return '$'
    case '\\,': return ','
    default: return sequence
  }
}

module.exports = string
