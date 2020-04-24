/* eslint-disable no-param-reassign */
const elements = require('../elements');
const ind = require('../ind');
const loop = require('../common/loop');
const merge = require('../merge');
const strip = require('../strip');
const value = require('../value');
const makeResult = require('../result');

function OnceOnlyController(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  const settings = {};
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key);
  }
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, settings);
  }
  const els = node.children.filter((item) => !/Prop$/.test(item.name));
  const childrenResult = elements(els, context);
  const childrenLogic = childrenResult.logic || '';
  delete childrenResult.logic;
  merge(result, childrenResult);
  render(node, settings, result, childrenLogic);
  node.children = [];
  return result;
}

function attribute(node, key) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break;
    default:
      throw new Error(`Unrecognized OnceOnlyController attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments':
      settings.comment = value(node, context);
      break;
    default:
      throw new Error(`Unrecognized OnceOnlyController property: ${name}`);
  }
}

function render(node, settings, result, childrenLogic) {
  result.logic = `\n\n`;
  if (settings.comment) {
    result.logic += `/* ${settings.comment} */\n`;
  }
  const condition = renderCondition(node);
  result.logic +=
    '' +
    `if (${condition}) {
${ind(strip(childrenLogic))}
}`;
}

function renderCondition(node) {
  if (loop(node.parent)) {
    return `first`;
  }
  return `__ITER === 0`;
}

module.exports = OnceOnlyController;
