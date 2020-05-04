const BaseElement = require('./BaseElement');
const elements = require('../elements');

const Style = {
  ByNumber: 0,
  ByPercent: 1,
};

class ThroughputController extends BaseElement {
  getOptions() {
    this.state.options = {
      style: this.getIntPropOrDefault('style', 1),
      perThread: this.getBoolProp('perThread'),
      maxThroughput: this.getIntPropOrDefault('maxThroughput', 1),
    };
  }

  getPercentage() {
    const props = {};
    const float = this.node.children.find((x) => x.name === 'FloatProperty');

    float.children.forEach((i) => {
      if (['value', 'savedValue'].indexOf(`${i.name}`) === -1) {
        return;
      }

      props[i.name] = i.children.find((v) => v.type === 'text').text;
    });

    this.state.options = {
      ...this.state.options,
      ...props,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  handlePercentThroughput(value) {
    this.logic = {
      pre: '',
    };

    if (parseInt(value, 10) === 100) {
      this.logic.pre += `
      // TODO: Remove this condition as it will always return true
      `;
    }
    if (!this.hasThreadGroupLimitations()) {
      this.logic.pre += `if (__ITER % 100 <= ${parseInt(value, 10)}) {`;
    } else {
      const iterations = this.context.iterations || 1;
      const percentage = parseInt(value, 10);

      this.logic.pre += `if ((__ITER) / ${iterations} * 100 < ${percentage}) {`;
    }

    this.logic.post = '}';
  }

  hasThreadGroupLimitations() {
    return this.context.threadGroup && this.context.iterations;
  }

  // eslint-disable-next-line class-methods-use-this
  handleNumericThroughput(maxThroughput) {
    this.logic = {
      pre: '',
      post: '}',
    };

    if (
      this.context.threadGroup.iterations &&
      maxThroughput >= this.context.threadGroup.iterations
    ) {
      this.logic.pre += `
      // TODO: Remove this condition as it will always return true
      `;
    }
    this.logic.pre += `if (__ITER < ${maxThroughput}) {`;
  }

  run(node, context) {
    this.reset();
    this.node = node;
    this.context = context;

    this.getOptions();
    this.getPercentage();

    const { style, value, maxThroughput } = this.state.options;
    const els = node.children.filter(
      (item) => !/(Prop|Property)$/.test(item.name)
    );
    switch (style) {
      case Style.ByPercent:
        this.handlePercentThroughput(value);
        break;
      case Style.ByNumber:
        this.handleNumericThroughput(maxThroughput);
        break;
      default:
        throw new Error('Invalid execution style for throughput controller');
    }
    const childrenResults = elements(els);
    const childrenLogic = childrenResults.logic;
    delete childrenResults.logic;
    return {
      ...childrenResults,
      logic: this.hasLogic()
        ? `
    ${this.logic.pre}
      ${childrenLogic}
    ${this.logic.post}
`
        : childrenLogic,
    };
  }

  hasLogic() {
    return this.logic.pre && this.logic.post;
  }
}

function execute(node, context) {
  if (node.attributes.enabled === 'false') {
    return { state: [] };
  }
  console.log(context);
  const controller = new ThroughputController();
  return controller.run(node, context);
}

module.exports = execute;
