/**
 * Extract text
 *
 * @param {Iterable} nodes - Nodes to extract text from.
 */
function text (nodes) {
  return nodes.reduce(reduce, '')
}

function reduce (text, node) {
  return text + node.text
}

module.exports = text
