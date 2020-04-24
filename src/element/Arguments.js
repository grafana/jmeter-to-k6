/* eslint-disable no-param-reassign */
const variables = require('../common/variables');
const merge = require('../merge');
const value = require('../value');
const makeResult = require('../result');

function Arguments(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, result);
  }
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, result, context);
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
      throw new Error(`Unrecognized Arguments attribute: ${key}`);
  }
}

function property(node, result, context) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments': {
      const comments = value(node, context);
      if (comments) {
        result.init += `\n\n/* ${comments} */`;
      }
      break;
    }
    case 'arguments': {
      const variablesResult = variables(node, context);
      merge(result, variablesResult);
      break;
    }
    default:
      throw new Error(`Unrecognized Arguments property: ${name}`);
  }
}

module.exports = Arguments;
