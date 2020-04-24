const string = require("./string/convert");
const text = require("./text");

function value(node, _) {
  return string(text(node.children));
}

module.exports = value;
