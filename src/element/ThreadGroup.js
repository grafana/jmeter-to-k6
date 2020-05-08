const { Post } = require('../symbol');
const merge = require('../merge');
const elements = require('../elements');
const ind = require('../ind');
const strip = require('../strip');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function ThreadGroup(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }

  result.options.stages = [{}];
  result.logic = '';
  const settings = {};
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, result);
  }
  const props = node.children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, settings, result);
  }
  const els = node.children.filter((item) => !/Prop$/.test(item.name));
  if (infinite(settings)) {
    merge(result, elements(els, context));
  } else {
    if (settings.iterations) {
      // eslint-disable-next-line no-param-reassign
      context.iterations = settings.iterations;
    }

    const childrenResult = elements(els, context);
    const childrenLogic = childrenResult.logic || '';
    delete childrenResult.logic;

    merge(result, childrenResult);
    result.logic +=
      '' +
      `if (__ITER < ${settings.iterations}) {
${ind(strip(childrenLogic))}
}`;
  }
  result.user = true;

  return result;
}

function infinite(settings) {
  return (
    !('infinite' in settings || 'iterations' in settings) ||
    settings.infinite ||
    settings.iterations < 0
  );
}

function attribute(_node, key, _result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break;
    default:
      throw new Error(`Unrecognized ThreadGroup attribute: ${key}`);
  }
}

function property(node, context, settings, result) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'scheduler':
    case 'duration':
    case 'delay':
    case 'delayedStart':
      break;
    case 'comments': {
      const comments = value(node, context);
      // eslint-disable-next-line no-param-reassign
      result.logic += `\n\n/* ${comments} */`;
      break;
    }
    case 'main_controller': {
      const props = node.children.filter((item) => /Prop$/.test(item.name));
      for (const prop of props) {
        iterations(prop, context, settings, result);
      }
      break;
    }
    case 'num_threads': {
      const valueString = value(node, context);
      const valueParsed = Number.parseInt(valueString, 10);
      // eslint-disable-next-line no-param-reassign
      result.options.stages[0].target = valueParsed;
      break;
    }
    case 'on_sample_error':
      errorResponse(node, result);
      break;
    case 'ramp_time': {
      const valueString = value(node, context);
      // eslint-disable-next-line no-param-reassign
      result.options.stages[0].duration = `${valueString}s`;
      break;
    }
    case 'same_user_on_next_iteration': {
      const val = value(node, context);
      // eslint-disable-next-line no-param-reassign
      result.options.noVUConnectionReuse = val === 'false';
      break;
    }
    case 'start_time':
    case 'end_time':
      // ignore these props.
      break;
    default:
      throw new Error(`Unrecognized ThreadGroup property: ${name}`);
  }
}

function iterations(node, context, settings, _result) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'continue_forever':
      // eslint-disable-next-line no-param-reassign
      settings.infinite = value(node, context) === 'true';
      break;
    case 'loops':
      // eslint-disable-next-line no-param-reassign
      settings.iterations = Number.parseInt(text(node.children), 10);
      break;
    default:
      throw new Error(`Unrecognized ThreadGroup iteration property: ${name}`);
  }
}

function errorResponse(node, result) {
  const action = renderAction(text(node.children), result);
  const logic = `if (Math.floor(r.status/100) !== 2) ${action}`;
  result.defaults.push({ [Post]: [logic] });
}

function renderAction(action, result) {
  switch (action) {
    case 'continue':
      return `{}`; // Ignore
    case 'startnextloop':
      return `continue`; // Continue loop
    case 'stopthread': // Stop thread
    case 'stoptest': // Stop test
    case 'stoptestnow': // Stop test now
      result.imports.set('fail', { base: 'k6' });
      return `fail('Request failed: ' + r.status)`;
    default:
      throw new Error(`Unrecognized sampler error response: ${action}`);
  }
}

module.exports = ThreadGroup;
