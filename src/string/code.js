const runtimeString = require('./run')

// Render JMeter string as JavaScript code
function code (value) {
  return `eval(${runtimeString(value)})`
}

module.exports = code
