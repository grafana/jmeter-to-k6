/* eslint-disable no-param-reassign */
const { Runtime } = require('../symbol');
const elements = require('../elements');
const ind = require('../ind');
const merge = require('../merge');
const strip = require('../strip');
const value = require('../value');
const makeResult = require('../result');

function RunTime(node, context) {
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

  const els = node.children
    .filter((item) => !/Prop$/.test(item.name))
    .filter((item) => item.type === 'element');

  if (sufficient(settings)) {
    render(settings, result, context, els);
  } else {
    throw new Error('Invalid RunTime');
  }
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
      throw new Error(`Unrecognized RunTime attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments':
      settings.comment = value(node, context);
      break;
    case 'seconds':
      settings.time = Number.parseInt(value(node, context), 10) * 1000;
      break;
    default:
      throw new Error(`Unrecognized RunTime property: ${name}`);
  }
}

function sufficient(settings) {
  return 'time' in settings;
}

function render(settings, result, context, els) {
  context.defaults.push({ [Runtime]: true });
  const childrenResult = elements(els, context);
  context.defaults.pop();
  const childrenLogic = childrenResult.logic;
  delete childrenResult.logic;
  merge(result, childrenResult);
  result.logic = `\n\n`;
  if (settings.comment) {
    result.logic += `/* ${settings.comment} */\n`;
  }
  result.logic +=
    '' +
    `{
  const deadline = Date.now() + ${settings.time}
${ind(strip(childrenLogic))}
}`;
}

module.exports = RunTime;
