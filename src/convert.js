const analyze = require('./analyze');
const render = require('./render');

function convert(xml) {
  return render(analyze(xml));
}

module.exports = convert;
