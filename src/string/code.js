const runtimeString = require('./run')

/*
 * Double eval explanation
 *
 * Results in a double eval for strings with JMeter expressions.
 * First eval performs runtime JMeter expression interpolation.
 * Second eval executes constructed JavaScript code.
 * Necessary to achieve variable resolution on every pass;
 * a single eval would only read variables once.
 */

// Render JMeter string as JavaScript code
function code (value) {
  return `eval(${runtimeString(value)})`
}

module.exports = code
