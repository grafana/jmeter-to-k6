const interpolate = require('./interpolate')

const find = /(?:^|\\\\|[^\\])\${.*}/

// Evaluate convert time string
function string (value, context) {
  if (find.test(value)) return unescape(interpolate(value, context))
  else return value
}

function unescape (string) {
  return string.replace(/\\([\\$,])/g, '$1')
}

module.exports = string
