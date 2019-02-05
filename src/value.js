const string = require('./string/convert')
const text = require('./text')

function value (node, context) {
  return string(text(node.children))
}

module.exports = value
