const run = require('./string/run')
const text = require('./text')

function literal (node, context) {
  const raw = text(node.children || [])
  if (raw) return run(raw)
  else return null
}

module.exports = literal
