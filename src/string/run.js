const render = require('./render')

const find = /(?:^|\\\\|[^\\])\${.*}/

/*
 * Double eval explanation
 *
 * First eval performs runtime JMeter expression interpolation.
 * Second eval executes constructed JavaScript code.
 * Necessary to achieve variable resolution on every pass;
 * a single eval would only read variables once.
 */

// Render runtime string
function runtimeString (value) {
  if (find.test(value)) return `eval(eval('${unescape(render(value))}'))`
  else return `eval(\`${value.replace('`', '\\`')}\`)`
}

function unescape (string) {
  return string.replace(/\\([\\$,])/g, '$1')
}

module.exports = runtimeString
