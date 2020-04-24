/* eslint-disable no-param-reassign */
const { Check } = require('../symbol');
const literal = require('../literal');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function JSONPathAssertion(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  const settings = { format: 'JSON' };
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, settings);
  }
  if (!settings.name) {
    settings.name = 'JSONPathAssertion';
  }
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, settings);
  }
  if (settings.path && settings.format) {
    result.imports.set('jsonpath', 'jsonpath');
    if (settings.format === 'YAML') {
      result.imports.set('yaml', 'yaml');
    }
    if (settings.regex) {
      result.imports.set('perlRegex', 'perl-regex');
    }
    const logic = render(settings);
    result.defaults.push({ [Check]: { [settings.name]: logic } });
  }
  return result;
}

function attribute(node, key, settings) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
      break;
    case 'testname':
      settings.name = node.attributes.testname;
      break;
    default:
      throw new Error(`Unrecognized JSONPathAssertion attribute: ${key}`);
  }
}

function property(node, context, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'JSONVALIDATION':
      break;
    case 'comments':
      settings.name += ` - ${value(node, context)}`;
      break;
    case 'JSON_PATH':
      settings.path = literal(node, context);
      break;
    case 'EXPECTED_VALUE':
      if (text(node.children) === '[]') {
        settings.test = '[]';
      } else {
        settings.test = literal(node, context);
      }
      break;
    case 'EXPECT_NULL':
      if (value(node, context) === 'true') {
        settings.test = null;
      }
      break;
    case 'INVERT':
      settings.negate = value(node, context) === 'true';
      break;
    case 'ISREGEX':
      settings.regex = value(node, context) === 'true';
      break;
    case 'INPUT_FORMAT': {
      const format = value(node, context);
      if (!['JSON', 'YAML'].includes(format)) {
        throw new Error(`Unrecognized JSONPathAssertion format: ${format}`);
      }
      settings.format = format;
      break;
    }
    default:
      throw new Error(`Unrecognized JSONPathAssertion property: ${name}`);
  }
}

function render(settings) {
  const parser = settings.format === 'YAML' ? 'yaml' : 'JSON';
  return (
    '' +
    `const body = (() => {
  try { return ${parser}.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, ${settings.path})
${test(settings)}`
  );
}

function test(settings) {
  if (settings.test === '[]') {
    return `return !values.length`;
  }
  if ('test' in settings) {
    return `return !!(${expr(settings)})`;
  }

  return `return !!values.length`;
}

function expr(settings) {
  const core = `values.find(value => ${itemExpr(settings)})`;
  if (settings.negate) {
    return `!${core}`;
  }
  return core;
}

function itemExpr(settings) {
  if (settings.test === null) {
    return 'value === null';
  }

  const val = '(typeof value === "object" ? JSON.stringify(value) : value)';
  if (settings.regex) {
    return `perlRegex.match(${val}, ${settings.test})`;
  }
  return `${val} === ${settings.test}`;
}

module.exports = JSONPathAssertion;
