const render = require("./render");
const { variable } = require("../expression");

function unescape(string) {
  return string.replace(/\\([\\$,])/g, "$1");
}

// Render runtime string
// May contain runtime resolved interpolation
function runtimeString(value) {
  if (variable.test(value)) {
    return unescape(render(value));
  }

  return JSON.stringify(value);
}

module.exports = runtimeString;
