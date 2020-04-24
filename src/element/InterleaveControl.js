/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
const element = require('../element');
const expand = require('../expand');
const ind = require('../ind');
const merge = require('../merge');
const strip = require('../strip');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function InterleaveControl(node, context) {
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
  const els = expand(
    node.children
      .filter((item) => !/Prop$/.test(item.name))
      .filter((item) => item.type === 'element')
      .map((item) =>
        item.name === 'hashTree'
          ? item.children.filter((innerItem) => innerItem.type === 'element')
          : item
      )
  );
  render(settings, result, context, els);
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
      throw new Error(`Unrecognized InterleaveControl attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments':
      settings.comment = value(node, context);
      break;
    case 'accrossThreads': {
      const crossthread = text(node.children) === 'true';
      if (crossthread) {
        throw new Error('Crossthread interleaving not supported');
      }
      break;
    }
    case 'style':
      style(node, context, settings);
      break;
    default:
      throw new Error(`Unrecognized InterleaveControl property: ${name}`);
  }
}

/*
 * Value is a bit field encoded as a decimal integer.
 * Bits from low order, 0 based:
 *   0  disable limit subcontroller to 1 request per iteration
 */
function style(node, _context, _settings) {
  const bits = Number.parseInt(text(node.children), 10);
  if (!(bits & 0b1)) {
    // limit subcontroller to 1 request per iteration
    throw new Error('Ignore subcontrollers not supported');
  }
}

function render(settings, result, context, els) {
  const children = els.map((node) => element(node, context));
  const blocks = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const { logic } = child;
    delete child.logic;
    merge(result, child);
    blocks.push(`case ${i}:
${ind(strip(logic))}
  break`);
  }
  result.logic = `\n\n`;
  if (settings.comment) {
    result.logic += `/* ${settings.comment} */\n`;
  }
  const index = `(__ITER - ((__ITER/${blocks.length}|0)*${blocks.length}))`;
  result.logic +=
    '' +
    `{ const index = ${index}; switch (index) {
${ind(blocks.join('\n'))}
  default: throw new Error('Unexpected interleave index: ' + index)
} }`;
}

module.exports = InterleaveControl;
