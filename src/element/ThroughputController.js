const BaseElement = require('./BaseElement');

const Style = {
  ByNumber: 0,
  ByPercent: 1,
};

const reudandantComment = `
// TODO: Remove this condition as it will always return true
`;

class ThroughputController extends BaseElement {
  getOptions() {
    this.options = {
      style: this.getIntPropOrDefault('style', 1),
      perThread: this.getBoolProp('perThread'),
      maxThroughput: this.getIntPropOrDefault('maxThroughput', 1),
    };
  }

  loadPercentageProps() {
    const props = {};
    const float = this.node.children.find((x) => x.name === 'FloatProperty');

    float.children
      .filter((i) => /(savedV|v)alue$/.test(i.name))
      .forEach((i) => {
        const { text } = i.children.find((v) => v.type === 'text');
        props[i.name] = text;
      });

    this.options = {
      ...this.options,
      ...props,
    };
  }

  getPercentLogic(value) {
    let pre = '';

    if (parseInt(value, 10) === 100) {
      this.pre += reudandantComment;
    }

    if (!this.hasThreadGroupLimitations()) {
      pre += `if (__ITER % 100 <= ${parseInt(value, 10)}) {`;
    } else {
      const iterations = this.context.iterations || 1;
      const percentage = parseInt(value, 10);

      pre += `if ((__ITER) / ${iterations} * 100 < ${percentage}) {`;
    }

    return {
      pre,
      post: '}',
    };
  }

  hasThreadGroupLimitations() {
    return this.context.iterations;
  }

  getNumericThroughput(maxThroughput) {
    let pre = '';

    if (this.context.iterations && maxThroughput >= this.context.iterations) {
      pre += reudandantComment;
    }

    pre += `if (__ITER < ${maxThroughput}) {`;

    return {
      pre,
      post: '}',
    };
  }

  run() {
    this.getOptions();
    this.loadPercentageProps();

    const { style, value, maxThroughput } = this.options;

    switch (style) {
      case Style.ByPercent:
        this.logic = this.getPercentLogic(value);
        break;
      case Style.ByNumber:
        this.logic = this.getNumericThroughput(maxThroughput);
        break;
      default:
        throw new Error(
          `Invalid execution style "${style}"for throughput controller`
        );
    }

    const children = this.getDataForChildren();

    return {
      ...children.result,
      logic: [
        this.logic.pre || '',
        children.logic || '',
        this.logic.post || '',
      ].join(''),
    };
  }
}

function execute(node, context) {
  const controller = new ThroughputController(node, context);
  return controller.isEnabled // skip children as well if disabled
    ? controller.run()
    : controller.emptyResponse;
}

module.exports = execute;
