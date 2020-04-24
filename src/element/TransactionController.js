const elements = require('../elements');
const ind = require('../ind');
const merge = require('../merge');
const strip = require('../strip');
const value = require('../value');
const makeResult = require('../result');

function TransactionController(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  const settings = { all: true };
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, settings);
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
  if (sufficient(settings)) {
    render(settings, result, childrenLogic);
  } else {
    throw new Error('Invalid TransactionController');
  }
  // eslint-disable-next-line no-param-reassign
  node.children = [];
  return result;
}

function attribute(node, key, settings) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
      break;
    case 'testname':
      // eslint-disable-next-line no-param-reassign
      settings.name = node.attributes.testname;
      break;
    default:
      throw new Error(`Unrecognized TransactionController attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'includeTimers':
      break;
    case 'comments':
      // eslint-disable-next-line no-param-reassign
      settings.comment = value(node, context);
      break;
    case 'parent':
      // eslint-disable-next-line no-param-reassign
      settings.parent = value(node, context) === 'true';
      break;
    default:
      throw new Error(`Unrecognized TransactionController property: ${name}`);
  }
}

function sufficient(settings) {
  return settings.all && settings.name;
}

function render(settings, result, childrenLogic) {
  result.imports.set('group', { base: 'k6' });
  // eslint-disable-next-line no-param-reassign
  result.logic = `\n\n`;
  if (settings.comment) {
    // eslint-disable-next-line no-param-reassign
    result.logic += `/* ${settings.comment} */\n`;
  }
  // eslint-disable-next-line no-param-reassign
  result.logic +=
    '' +
    `group(${JSON.stringify(settings.name)}, () => {
${ind(strip(childrenLogic))}
})`;
}

module.exports = TransactionController;
