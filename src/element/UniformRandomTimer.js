const path = require('path');
const BaseElement = require('./BaseElement');
const makeResult = require('../result');

class UniformRandomTimer extends BaseElement {
  loadOptions() {
    const toSeconds = (v) => v / 1000;
    const { delay, range } = this.getPropsAsDictionary();
    this.options = {
      delay: toSeconds(parseInt(delay, 10) || 0),
      range: toSeconds(parseInt(range, 10) || 0),
    };
  }

  run() {
    const result = makeResult();
    this.loadOptions();
    result.imports.set('sleep', { base: 'k6' });
    result.imports.set(
      'getRandomInt',
      path.join(__dirname, '/../random-int/index.js')
    );

    result.logic = `
      sleep(${this.options.delay} + (getRandomInt(0, ${
      this.options.range * 1000
    }) / 1000));
    `;
    return result;
  }
}

function execute(node, context) {
  const controller = new UniformRandomTimer(node, context);
  return controller.isEnabled // skip children as well if disabled
    ? controller.run()
    : controller.emptyResponse;
}

module.exports = execute;
