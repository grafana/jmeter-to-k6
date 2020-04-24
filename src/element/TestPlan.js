const variables = require('../common/variables');
const merge = require('../merge');
const elements = require('../elements');
const value = require('../value');
const makeResult = require('../result');
const makeContext = require('../context');

function TestPlan(node, context = makeContext()) {
  const result = makeResult();
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, result);
  }
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, result);
  }
  const els = node.children.filter((item) => !/Prop$/.test(item.name));
  merge(result, elements(els, context));
  return result;
}

function attribute(_node, key, _result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break;
    default:
      throw new Error(`Unrecognized TestPlan attribute: ${key}`);
  }
}

function property(node, context, result) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'functional_mode':
    case 'serialize_threadgroups':
    case 'tearDown_on_shutdown':
    case 'user_define_classpath':
      break;
    case 'comments': {
      const comments = value(node, context);
      if (comments) {
        // eslint-disable-next-line no-param-reassign
        result.init += `\n\n/* ${comments} */`;
      }
      break;
    }
    case 'user_defined_variables': {
      const collection = node.children.find(
        (item) => item.name === 'collectionProp'
      );
      const variablesResult = variables(collection, context);
      merge(result, variablesResult);
      break;
    }
    default:
      throw new Error(`Unrecognized TestPlan property: ${name}`);
  }
}

module.exports = TestPlan;
