const BaseElement = require('./BaseElement');
const makeResult = require('../result');

class CSVDataSetPreProcessor extends BaseElement {
  run() {
    const result = makeResult();
    const { variableNames, delimiter } = this.getPropsAsDictionary();
    if (variableNames) {
      // console.log(variableNames.split(delimiter || ','));
      variableNames
        .split(delimiter || ',')
        .forEach((n) =>
          [result, this.context].forEach((r) =>
            r.vars.set(n, { value: 'CSV_PLACEHOLDER' })
          )
        );
    }
    return result;
  }
}

function execute(node, context) {
  const controller = new CSVDataSetPreProcessor(node, context);
  return controller.isEnabled // skip children as well if disabled
    ? controller.run()
    : controller.emptyResponse;
}

module.exports = execute;
