/* eslint-disable no-param-reassign */
const { Post } = require('../symbol');
const ind = require('../ind');
const literal = require('../literal');
const runtimeString = require('../string/run');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function HtmlExtractor(node, context) {
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
      throw new Error(`Unrecognized HtmlExtractor attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'extractor_impl':
    case 'scope':
      break;
    case 'attribute':
      settings.attribute = literal(node, context);
      break;
    case 'comments':
      settings.comment = value(node, context);
      break;
    case 'default':
      settings.default = literal(node, context);
      break;
    case 'default_empty_value':
      settings.clear = value(node, context) === 'true';
      break;
    case 'expr':
      settings.query = text(node.children);
      break;
    case 'match_number':
      settings.index = Number.parseInt(value(node, context), 10);
      break;
    case 'refname':
      settings.output = text(node.children);
      break;
    default:
      throw new Error(`Unrecognized HtmlExtractor property: ${name}`);
  }
}

function sufficient(settings) {
  return 'index' in settings && settings.output && settings.query;
}

function render(settings, result) {
  result.state.add('output');
  result.state.add('matches');
  result.state.add('match');
  result.state.add('extract');
  result.state.add('vars');
  result.imports.set('html', 'k6/html');
  let logic = '';
  if (settings.comment) {
    logic += `/* ${settings.comment} */\n`;
  }
  const query = JSON.stringify(settings.query);
  const output = runtimeString(settings.output);
  const transport = renderTransport(settings);
  logic +=
    '' +
    `{
  output = ${output}
  const doc = html.parseHTML(r.body)
  matches = doc.find(${query})
${ind(transport)}
}`;
  result.defaults.push({ [Post]: [logic] });
}

function renderTransport(settings) {
  if (settings.index < 0) {
    return renderDistribute(settings);
  }

  const select = renderSelect(settings);
  const extract = renderExtract(settings);
  const write = renderWrite(settings);
  return `match = ${select}
extract = ${extract}
${write}`;
}

function renderDistribute(settings) {
  const def = renderDefault(settings);
  const attr = settings.attribute;
  const extract = attr ? `match.attr(${attr})` : `match.text()`;
  return `${
    def ? `vars[output] = ${def}\n` : ''
  }vars[output + '_matchNr'] = matches.size()
for (let i = matches.size(); i >= 0; i--) {
  match = matches.eq(i)
  vars[output + '_' + (i+1)] = ${extract}
}`;
}

function renderSelect(settings) {
  const { index } = settings;
  if (index > 0) {
    return namedSelect(index);
  }
  return randomSelect();
}

function namedSelect(index) {
  return `(${index} > matches.size() ? null : matches.eq(${index - 1}))`;
}

function randomSelect() {
  const index = `Math.floor(Math.random()*matches.size())`;
  const extract = `matches.eq(${index})`;
  return `(matches.size() === 0 ? null : ${extract})`;
}

function renderExtract(settings) {
  if (settings.attribute) {
    const attr = settings.attribute;
    return `(match ? match.attr(${attr}) : null)`;
  }
  return `(match ? match.text() : null)`;
}

function renderWrite(settings) {
  const def = renderDefault(settings);
  if (def) {
    return `vars[output] = extract || ${def}`;
  }
  return `if (extract) vars[output] = extract`;
}

function renderDefault(settings) {
  return (settings.clear && `''`) || settings.default || '';
}

module.exports = HtmlExtractor;
