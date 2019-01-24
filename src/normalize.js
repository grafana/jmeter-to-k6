/*
 * Normalize document tree
 *
 * Container elements are followed by a sibling hashTree containing children,
 * an awkward pattern to deal with. Moves hashTree elements into children.
 */
function normalize (tree) {
  const children = tree.children
  for (let i = 0, parent = null; i < children.length; i++) {
    const child = children[i]
    if (child.type !== 'element') continue
    normalize(child)
    if (child.name === 'hashTree') {
      if (parent) {
        const [ hashTree ] = children.splice(i, 1)
        hashTree.parent = parent
        parent.children.push(hashTree)
        i--
      }
      parent = null
    } else parent = child
  }
}

module.exports = normalize
