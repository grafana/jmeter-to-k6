const render = require('./render')

const find = /(?:^|\\\\|[^\\])\${.*}/

// Render runtime string
// May contain runtime resolved interpolation
function runtimeString (value) {
  if (find.test(value)) return unescape(render(value))
  else return `\`${value.replace('`', '\\`')}\``
}

function unescape (string) {
  return string.replace(/\\([\\$,])/g, '$1')
}

module.exports = runtimeString
