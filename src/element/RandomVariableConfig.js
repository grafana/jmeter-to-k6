const BaseElement = require('./BaseElement');

class RandomVariableConfig extends BaseElement {
  run() {
    return this.emptyResponse;
  }
}

function execute(node, context) {
  const config = new RandomVariableConfig(node, context);

  return config.isEnabled // skip children as well if disabled
    ? config.run()
    : config.emptyResponse;
}

module.exports = execute;
