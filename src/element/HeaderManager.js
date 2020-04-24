const { Header } = require('../symbol');
const properties = require('../common/properties');
const makeResult = require('../result');

function HeaderManager(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  const settings = new Map();
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, result);
  }
  const { children } = node;
  const props = children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, settings);
  }
  if (settings.size) {
    result.defaults.push({ [Header]: settings });
  }
  return result;
}

function attribute(_node, key, _result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break;
    default:
      throw new Error(`Unrecognized HeaderManager attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments':
      break;
    case 'headers':
      headers(node, context, settings);
      break;
    default:
      throw new Error(`Unrecognized HeaderManager property: ${name}`);
  }
}

function headers(node, context, settings) {
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    header(prop, context, settings);
  }
}

function header(node, context, settings) {
  const props = properties(node, context);
  if (!(props.name && props.value)) {
    throw new Error('Invalid header entry');
  }
  settings.set(props.name, props.value);
}

module.exports = HeaderManager;
