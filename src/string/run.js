const render = require('./render')
const { variable } = require('../expression')

// Render runtime string
// May contain runtime resolved interpolation
function runtimeString (value) {
  if (variable.test(value)) return unescape(render(value))
  else return JSON.stringify(value)
}

function unescape (string) {
  return string.replace(/\\([\\$,])/g, '$1')
}

module.exports = runtimeString
