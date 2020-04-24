module.exports = (...args) => {
  return property(...args);
};

const properties = require('./properties');
const run = require('../string/run');
const text = require('../text');
const value = require('../value');

function property(node, context, raw = false) {
  const name = node.attributes.name.split('.').pop();
  if (raw) {
    return { [name]: extractRaw(node) };
  }
  return { [name]: extractValue(node, context, raw) };
}

function extractRaw(node) {
  return text(node.children) || null;
}

function extractValue(node, context, raw) {
  const type = node.name.split('Prop')[0];
  const encoded = value(node, context);
  switch (type) {
    case 'bool':
      return decodeBool(encoded);
    case 'element':
      return extractElement(node, context, raw);
    case 'string':
    case 'long':
      return decodeString(encoded);
    default:
      throw new Error(`Unrecognized property type: ${type}`);
  }
}

function decodeBool(val) {
  switch (val) {
    case 'true':
      return true;
    case 'false':
      return false;
    case '':
      return null;
    default:
      throw new Error(`Unrecognized boolProp value: ${val}`);
  }
}

function decodeString(val) {
  if (val) {
    return run(val);
  }
  return null;
}

function extractElement(node, context, raw) {
  const type = node.attributes.elementType;
  if (type === 'Arguments') {
    return extractArguments(node, context, raw);
  }
  throw new Error(`Unrecognized elementProp type: ${type}`);
}

function extractArguments(node, context, raw) {
  const collection = node.children.find(
    (item) => item.name === 'collectionProp'
  );
  const elements = collection.children.filter(
    (item) => item.type === 'element' && item.name.endsWith('Prop')
  );
  return elements.map((element) => properties(element, context, raw));
}
