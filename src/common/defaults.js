/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
const expand = require('../expand');
const makeContext = require('../context');
const merge = require('../merge');

const requiresPreprocessing = ['CSVDataSet', 'Arguments'];

const route = {
  AuthManager: require('../element/AuthManager'),
  Arguments: require('../element/Arguments'),
  BoundaryExtractor: require('../element/BoundaryExtractor'),
  'com.atlantbh.jmeter.plugins.jsonutils.jsonpathassertion.JSONPathAssertion': require('../element/JSONPathAssertion'),
  'com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor': require('../element/JSONPathExtractor'),
  CSVDataSet: require('../element/CSVDataSetPreProcessor'),
  ConfigTestElement: require('../element/ConfigTestElement'),
  ConstantTimer: require('../element/ConstantTimer'),
  DurationAssertion: require('../element/DurationAssertion'),
  HeaderManager: require('../element/HeaderManager'),
  HtmlExtractor: require('../element/HtmlExtractor'),
  JSONPostProcessor: require('../element/JSONPostProcessor'),
  RegexExtractor: require('../element/RegexExtractor'),
  ResponseAssertion: require('../element/ResponseAssertion'),
  ResultAction: require('../element/ResultAction'),
};

function extractDefaults(node, result, context = makeContext()) {
  const values = {};

  const configs = extractConfigs(node);

  for (const config of configs) {
    const configResult = route[config.name](config, context);
    const {
      defaults: [configValues],
    } = configResult;

    configResult.defaults = [];
    merge(result, configResult);
    if (!configValues) {
      continue;
    }
    for (const key of [
      ...Object.keys(configValues),
      ...Object.getOwnPropertySymbols(configValues),
    ]) {
      mergeCategory(values, configValues, key);
    }
  }

  processChildren(node);

  return [...context.defaults, values];
}

function processChildren(node) {
  node.children
    .filter((item) => item.name === 'hashTree')
    .forEach((tree) => filterChildren(tree));

  filterChildren(node);
}

function filterChildren(node) {
  node.children = node.children.filter((item) => !isFilteredNode(item));
}

function isFilteredNode(item) {
  return (
    item.type === 'element' &&
    item.name in route &&
    !requiresPreprocessing.includes(item.name)
  );
}

function extractConfigs(node) {
  return expand(
    node.children
      .filter((item) => item.type === 'element')
      .map((item) =>
        item.name === 'hashTree'
          ? item.children.filter((innerItem) => innerItem.type === 'element')
          : item
      )
  ).filter((item) => item.name in route);
}

function mergeCategory(base, update, key) {
  if (Array.isArray(update[key])) {
    mergeArray(base, update, key);
  } else if (update[key] instanceof Map) {
    mergeMap(base, update, key);
  } else {
    mergeObject(base, update, key);
  }
}

function mergeArray(base, update, key) {
  if (!(key in base)) {
    base[key] = [];
  }
  base[key].push(...update[key]);
}

function mergeMap(base, update, key) {
  if (!(key in base)) {
    base[key] = new Map();
  }
  for (const [name, value] of update[key]) {
    base[key].set(name, value);
  }
}

function mergeObject(base, update, key) {
  if (!(key in base)) {
    base[key] = {};
  }
  for (const name of Object.keys(update[key])) {
    mergeValue(base[key], update[key], name);
  }
}

function mergeValue(base, update, key) {
  if (Array.isArray(update[key])) {
    if (!(key in base)) {
      base[key] = [];
    }
    base[key].push(...update[key]);
  } else {
    base[key] = update[key];
  }
}

module.exports = extractDefaults;
