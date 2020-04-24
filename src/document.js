const element = require('./element');
const normalize = require('./normalize');

/**
 * Convert parsed document
 *
 * @param {object} tree - Parsed document tree.
 *
 * @return {ConvertResult}
 */
function document(tree) {
  normalize(tree);
  const root = tree.children[0];
  return element(root);
}

module.exports = document;
