const literal = require('../literal');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function BeanShellPostProcessor(node, context) {
  let result = makeResult();
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
  if (sufficient(settings)) {
    result = {
      ...result,
      ...render(settings, result),
    };
  }
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
      throw new Error(`Unrecognized BeanShellPostProcessor attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'parameters':
    case 'resetInterpreter':
      break;
    case 'comments':
      // eslint-disable-next-line no-param-reassign
      settings.comment = value(node, context);
      break;
    case 'filename':
      // eslint-disable-next-line no-param-reassign
      settings.path = literal(node, context);
      break;
    case 'script':
      // eslint-disable-next-line no-param-reassign
      settings.code = text(node.children);
      break;
    default:
      throw new Error(`Unrecognized BeanShellPostProcessor property: ${name}`);
  }
}

function sufficient(settings) {
  return settings.code || settings.path;
}

function render(settings, input) {
  const result = input;

  result.logic = `\n\n/* BeanShellPostProcessor\n\n`;

  if (settings.comment) {
    result.logic += `${settings.comment}\n\n`;
  }
  if (settings.path) {
    result.logic += `file: ${settings.path}\n\n`;
  } else {
    result.logic += `${settings.code.replace('*/', '* /')}\n\n`;
  }
  result.logic += `*/`;

  return result;
}

module.exports = BeanShellPostProcessor;
