const run = require('./string/run');
const text = require('./text');

function literal(node, _context) {
  const raw = text(node.children || []);
  if (raw) {
    return run(raw);
  }
  return null;
}

module.exports = literal;
