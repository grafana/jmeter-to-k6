function loop(node) {
  switch (node.name) {
    case 'ForeachController':
    case 'LoopController':
    case 'WhileController':
      return true;
    default:
      return false;
  }
}

module.exports = loop;
