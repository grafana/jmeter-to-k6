/**
 * Extract text
 *
 * @param {Iterable} nodes - Nodes to extract text from.
 */

function reduce(text, node) {
  return text + node.text;
}

function extractText(nodes) {
  return nodes.reduce(reduce, "");
}

module.exports = extractText;
