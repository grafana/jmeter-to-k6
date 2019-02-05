function runnable (node) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'Fake':
    case 'hashTree':
    case 'IfController':
    case 'WhileController':
      return true
    default: return false
  }
}

module.exports = runnable
