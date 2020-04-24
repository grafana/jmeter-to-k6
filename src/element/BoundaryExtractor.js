const { Post } = require('../symbol');
const literal = require('../literal');
const renderInput = require('../common/input');
const runtimeString = require('../string/run');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function BoundaryExtractor(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  const settings = { component: 'false' };
  Object.keys(node.attributes).forEach((key) => {
    attribute(node, key);
  });

  const props = node.children.filter((item) => /Prop$/.test(item.name));
  props.forEach((prop) => {
    property(prop, context, settings);
  });

  if (sufficient(settings)) {
    render(settings, result);
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
      throw new Error(`Unrecognized BoundaryExtractor attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'comments':
      // eslint-disable-next-line no-param-reassign
      settings.comment = value(node, context);
      break;
    case 'default':
      // eslint-disable-next-line no-param-reassign
      settings.default = literal(node, context);
      break;
    case 'default_empty_value':
      // eslint-disable-next-line no-param-reassign
      settings.clear = text(node.children) === 'true';
      break;
    case 'lboundary':
      // eslint-disable-next-line no-param-reassign
      settings.left = literal(node, context);
      break;
    case 'match_number':
      // eslint-disable-next-line no-param-reassign
      settings.index = Number.parseInt(text(node.children), 10);
      break;
    case 'rboundary':
      // eslint-disable-next-line no-param-reassign
      settings.right = literal(node, context);
      break;
    case 'refname':
      // eslint-disable-next-line no-param-reassign
      settings.output = text(node.children);
      break;
    case 'scope':
      // eslint-disable-next-line no-param-reassign
      settings.samples = text(node.children);
      break;
    case 'useHeaders':
      // eslint-disable-next-line no-param-reassign
      settings.component = text(node.children);
      break;
    default:
      throw new Error(`Unrecognized BoundaryExtractor property: ${name}`);
  }
}

function sufficient(settings) {
  return (
    settings.left &&
    'index' in settings &&
    settings.right &&
    settings.output &&
    settings.component
  );
}

function render(settings, result) {
  result.state.add('regex');
  result.state.add('matches');
  result.state.add('match');
  result.state.add('extract');
  result.state.add('vars');
  let logic = '';
  if (settings.comment) {
    logic += `/* ${settings.comment} */\n`;
  }
  const left = escape(settings.left);
  const right = escape(settings.right);
  const regex = `new RegExp(${left} + '(.*)' + ${right}, 'g')`;
  const input = renderInput(settings.component, result);
  const transport = renderTransport(settings);
  logic +=
    '' +
    `regex = ${regex}
matches = (() => {
  const matches = []
  while (match = regex.exec(${input})) matches.push(match[1])
  return matches
})()
${transport}`;
  result.defaults.push({ [Post]: [logic] });
}

function escape(string) {
  return string.replace(/[-/^$*+?.()|[\]{}]|\\\\/g, '\\\\$&');
}

function renderTransport(settings) {
  if (settings.index < 0) {
    return renderDistribute(settings);
  }

  const extract = renderExtract(settings);
  const write = renderWrite(settings);
  return `extract = ${extract}
${write}`;
}

function renderDistribute(settings) {
  const output = runtimeString(settings.output);
  const defaultValue = renderDefault(settings);
  const components = [];
  if (defaultValue) {
    components.push(`vars[${output}] = ${defaultValue}`);
  }
  components.push(`vars[${output} + '_matchNr'] = matches.length`);
  components.push(
    '' +
      `for (let i = (matches.length - 1); i >= 0; i--) {
  vars[${output} + '_' + (i+1)] = matches[i]
}`
  );
  return components.join('\n');
}

function renderExtract(settings) {
  const { index } = settings;
  if (index > 0) {
    return namedExtract(index);
  }
  return randomExtract();
}

function namedExtract(index) {
  return `(${index} >= matches.length ? null : matches[${index - 1}])`;
}

function randomExtract() {
  const index = `Math.floor(Math.random()*matches.length)`;
  const extract = `matches[${index}]`;
  return `(matches.length === 0 ? null : ${extract})`;
}

function renderWrite(settings) {
  const output = runtimeString(settings.output);
  const defaultValue = renderDefault(settings);
  if (defaultValue) {
    return `vars[${output}] = extract || ${defaultValue}`;
  }
  return `if (extract) vars[${output}] = extract`;
}

function renderDefault(settings) {
  return (settings.clear && `''`) || settings.default || null;
}

module.exports = BoundaryExtractor;
