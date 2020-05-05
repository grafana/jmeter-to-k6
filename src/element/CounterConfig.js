const path = require('path');
const BaseElement = require('./BaseElement');
const makeResult = require('../result');
const merge = require('../merge');
const decimalFormat = require('../decimal-format');

class CounterConfig extends BaseElement {
  loadOptions() {
    const {
      name,
      start,
      end,
      format,
      inc: increment,
      per_user: perUser,
    } = this.getPropsAsDictionary();

    if (!name) {
      throw new Error(
        'Counters must have a name. Please edit your jmx and try again'
      );
    }

    if (!format) {
      throw new Error(
        'Counters must have a format. Please edit your jmx and try again'
      );
    }

    this.options = {
      name,
      start: parseInt(start, 10) || 0,
      end: parseInt(end, 10) || undefined,
      increment: parseInt(increment, 10) || 1,
      perUser: perUser === 'true',
      format,
    };
  }

  run() {
    this.loadOptions();

    const logic = {
      pre: '',
      post: '',
    };

    if (!this.options.perUser) {
      logic.pre += `

      /*
       * Warning: Per user was set to false for the counter ${this.options.name}.
       *
       * This was ignored as k6 VUs don't share runtime.
       * To make each iteration unique, consider modifying your usage of the counter
       * variable to use __VU either as a prefix or suffix.
       */

      `;
    }

    const labels = {
      name: `${this.options.name}`,
      current: `${this.options.name}_CURRENT`,
      start: `${this.options.name}_START`,
      end: `${this.options.name}_END`,
      inc: `${this.options.name}_INC`,
      format: `${this.options.name}_FORMAT`,
    };

    logic.pre += `
      vars["${labels.current}"] += vars["${labels.inc}"]
    `;
    if (this.options.end) {
      logic.pre += `
      if (vars["${labels.current}"] > vars["${labels.end}"]) {
        vars["${labels.current}"] = vars["${labels.start}"]
      }`;
    }

    logic.post = `vars["${labels.name}"] = decimalFormat(vars["${labels.format}"], vars["${labels.current}"]);`;

    const result = makeResult();
    const children = this.getDataForChildren();

    merge(result, this.elements);

    const wrapVar = (value) => ({ value });

    result.imports.set(
      'decimalFormat',
      path.join(__dirname, '/../decimal-format/index.js')
    );

    [result, this.context].forEach((r) => {
      r.vars.set(
        labels.name,
        wrapVar(decimalFormat(this.options.format, this.options.start))
      );
      r.vars.set(labels.start, wrapVar(this.options.start));
      r.vars.set(labels.end, wrapVar(this.options.end));
      r.vars.set(labels.inc, wrapVar(this.options.increment));
      r.vars.set(labels.current, wrapVar(this.options.start));
      r.vars.set(labels.format, wrapVar(this.options.format));
    });

    result.logic = [
      logic.pre || '',
      children.logic || '',
      logic.post || '',
    ].join('');

    return result;
  }
}

function execute(node, context) {
  const config = new CounterConfig(node, context);

  return config.isEnabled // skip children as well if disabled
    ? config.run()
    : config.emptyResponse;
}

module.exports = execute;
