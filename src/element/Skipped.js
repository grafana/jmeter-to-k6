// Skipped element that makes no sense to keep outside of JMeter
function Skipped(node, _context) {
  const parts = [];
  let current = node;
  while (current.parent) {
    parts.unshift(current.name);
    current = current.parent;
  }
  return {
    init: `\n// Element skipped: ${parts.join('.')}`,
  };
}

module.exports = Skipped;
