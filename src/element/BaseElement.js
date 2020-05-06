/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

const elements = require('../elements');
const makeResult = require('../result');

module.exports = class BaseElement {
  constructor(node, context) {
    this.node = node;
    this.context = context;
    this.result = makeResult();
  }

  get emptyResponse() {
    return { state: [] };
  }

  get enabled() {
    return this.node && this.node.attributes && this.node.attributes.enabled;
  }

  get node() {
    return this._node;
  }

  set node(val) {
    this._node = val;
  }

  get isEnabled() {
    return this._node.attributes.enabled === 'true';
  }

  get elements() {
    if (!this._node) {
      throw new Error('Tried to get props from node before the node was set.');
    }
    if (!this._elements) {
      this._elements = this._node.children.filter(
        (item) => !/(Prop|Property)$/.test(item.name)
      );
    }
    return this._elements;
  }

  hasLogic() {
    return this.logic && this.logic.pre && this.logic.post;
  }

  getBoolProp(key) {
    return this.props.find((x) => x.name === key).value === 'true';
  }

  getPropOrDefault(key, def) {
    return this.props.find((x) => x.name === key).value || def;
  }

  getIntPropOrDefault(key, def) {
    return parseInt(this.props.find((x) => x.name === key).value || def, 10);
  }

  getPropsAsDictionary() {
    return this.props.reduce((acc, item) => {
      const { name, value } = item;
      acc[name] = value;
      return acc;
    }, {});
  }

  getDataForChildren() {
    const result = elements(this.elements);
    const { logic } = result;
    delete result.logic;

    return {
      logic,
      result,
    };
  }

  getPropsForNode(node) {
    return node.children
      .filter((item) => /Prop$/.test(item.name))
      .map((x) => {
        return {
          name: x.attributes.name.split('.').pop(),
          value: (x.children.find((y) => y.type === 'text') || {}).text,
        };
      });
  }

  get props() {
    if (!this._node) {
      throw new Error('Tried to get props from node before the node was set.');
    }
    if (!this._props) {
      this._props = this.getPropsForNode(this.node);
    }
    return this._props;
  }
};
