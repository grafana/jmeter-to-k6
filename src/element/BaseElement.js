/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
module.exports = class BaseElement {
  reset() {
    this._node = undefined;
    this.state = {};
  }

  get node() {
    return this._node;
  }

  set node(val) {
    this._node = val;
  }

  getBoolProp(key) {
    return this.props.find((x) => x.name === key).value === 'true';
  }

  getIntPropOrDefault(key, def) {
    return parseInt(this.props.find((x) => x.name === key).value || def, 10);
  }

  // eslint-disable-next-line class-methods-use-this
  getPropsForNode(node) {
    return node.children
      .filter((item) => /Prop$/.test(item.name))
      .map((x) => {
        return {
          name: x.attributes.name.split('.').pop(),
          value: x.children.find((y) => y.type === 'text').text,
        };
      });
  }

  get props() {
    if (!this._props) {
      this._props = this.getPropsForNode(this.node);
    }
    return this._props;
  }
};
