const path = require('path');
const BaseElement = require('./BaseElement');
const decimalFormat = require('../decimal-format');
const getRandomInt = require('../random-int');
const merge = require('../merge');

class RandomVariableConfig extends BaseElement {
  getOptions() {
    const {
      maximumValue,
      minimumValue,
      outputFormat,
      perThread,
      randomSeed,
      variableName,
    } = this.getPropsAsDictionary();

    const formatDigits = outputFormat.split('').filter((d) => d === '0').length;

    this.validateFit(minimumValue, maximumValue, formatDigits);
    return {
      max: parseInt(maximumValue, 10) || 1,
      min: parseInt(minimumValue, 10) || 0,
      format: outputFormat || '0',
      perThread: perThread === 'true',
      name: variableName,
      seed: randomSeed,
    };
  }

  getLabels() {
    return {
      name: `${this.options.name}`,
      current: `${this.options.name}_CURRENT`,
      min: `${this.options.name}_MIN`,
      max: `${this.options.name}_MAX`,
      format: `${this.options.name}_FORMAT`,
    };
  }

  validateFit(minimumValue, maximumValue, formatDigits) {
    if (
      (maximumValue && maximumValue.length > formatDigits) ||
      (minimumValue && minimumValue.length > formatDigits)
    ) {
      throw new Error(
        `Min and max value for ${this.node.attributes.testname} wont fit inside the output format`
      );
    }
  }

  addVarsToResult() {
    const labels = this.getLabels();
    const wrapVar = (value) => ({ value });
    const current = getRandomInt(this.options.min, this.options.max);
    [this.result, this.context].forEach((r) => {
      r.vars.set(
        labels.name,
        wrapVar(decimalFormat(this.options.format, current))
      );
      r.vars.set(labels.min, wrapVar(this.options.min));
      r.vars.set(labels.max, wrapVar(this.options.max));
      r.vars.set(labels.current, wrapVar(current));
      r.vars.set(labels.format, wrapVar(this.options.format));
    });
  }

  addImportsToResult() {
    this.result.imports.set(
      'getRandomInt',
      path.join(__dirname, '/../random-int/index.js')
    );
    this.result.imports.set(
      'decimalFormat',
      path.join(__dirname, '/../decimal-format/index.js')
    );
  }

  addLogicToResult() {
    const { current, format, min, max, name } = this.getLabels();
    const ref = (label) => `vars["${label}"]`;

    const perThreadWarning =
      '// as k6 VUs are isolated, perThread=false has been ignored';

    this.result.logic = `
        ${!this.options.perThread ? perThreadWarning : ''}
        ${ref(current)} = getRandomInt(${ref(min)}, ${ref(max)})
        ${ref(name)} = decimalFormat(${ref(format)}, ${ref(current)})
     `;
  }

  run() {
    this.options = this.getOptions();
    this.addVarsToResult();
    this.addImportsToResult();
    this.addLogicToResult();
    const children = this.getDataForChildren();
    merge(this.result, children.result);
    return this.result;
  }
}

function execute(node, context) {
  const config = new RandomVariableConfig(node, context);

  return config.isEnabled // skip children as well if disabled
    ? config.run()
    : config.emptyResponse;
}

module.exports = execute;
