/* eslint-disable no-param-reassign */
const { Post } = require('../symbol');
const elements = require('../elements');
const merge = require('../merge');
const text = require('../text');
const value = require('../value');
const makeResult = require('../result');

function SteppingThreadGroup(node, context) {
  const result = makeResult();
  if (node.attributes.enabled === 'false') {
    return result;
  }
  result.options.stages = [];
  result.logic = '';
  const settings = {};
  for (const key of Object.keys(node.attributes)) {
    attribute(node, key, result);
  }
  const { children } = node;
  const props = children.filter((item) => /Prop$/.test(item.name));
  for (const prop of props) {
    property(prop, context, result, settings);
  }
  const els = children.filter((item) => !/Prop$/.test(item.name));
  const childrenResult = elements(els, context);
  const childrenLogic = childrenResult.logic || '';
  delete childrenResult.logic;
  merge(result, childrenResult);
  result.steppingUser += childrenLogic;
  if (sufficient(settings)) {
    render(settings, result);
  } else {
    throw new Error('Invalid SteppingThreadGroup');
  }
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
      throw new Error(`Unrecognized SteppingThreadGroup attribute: ${key}`);
  }
}

function property(node, context, result, settings) {
  const name = node.attributes.name.split('.').pop();
  switch (name) {
    case 'main_controller':
      break;
    case 'comments': {
      const comments = value(node, context);
      result.prolog += `\n\n/* ${comments} */`;
      break;
    }
    case 'flighttime':
      settings.peakTime = Number.parseInt(value(node, context), 10);
      break;
    case 'num_threads':
      settings.peakThreads = Number.parseInt(value(node, context), 10);
      break;
    case 'on_sample_error':
      errorResponse(node, result);
      break;
    case 'rampUp':
      settings.startStepTime = Number.parseInt(value(node, context), 10);
      break;
    case 'Start users count':
      settings.startStepThreads = Number.parseInt(value(node, context), 10);
      break;
    case 'Start users count burst':
      settings.burstThreads = Number.parseInt(value(node, context), 10);
      break;
    case 'Start users period':
      settings.startStepInterval = Number.parseInt(value(node, context), 10);
      break;
    case 'Stop users count':
      settings.stopStepThreads = Number.parseInt(value(node, context), 10);
      break;
    case 'Stop users period':
      settings.stopStepInterval = Number.parseInt(value(node, context), 10);
      break;
    case 'Threads initial delay':
      settings.presleep = Number.parseInt(value(node, context), 10);
      break;
    default:
      throw new Error(`Unrecognized SteppingThreadGroup property: ${name}`);
  }
}

function sufficient(settings) {
  return (
    settings.peakThreads &&
    settings.startStepThreads &&
    settings.peakThreads >= settings.startStepThreads
  );
}

function render(settings, result) {
  if (settings.comment) {
    result.prolog += `\n\n/* ${settings.comment} */`;
  }
  const stages = [];
  const prior = stages.length ? stages[stages.length - 1].target : 0;
  if (settings.presleep) {
    stages.push(presleep(settings));
  }
  if (settings.burstThreads) {
    stages.push(burst(settings));
  }
  stages.push(...start(settings, stages[stages.length - 1]));
  if (settings.peakTime) {
    stages.push(fly(settings));
  }
  if (settings.stopStepThreads) {
    stages.push(end(settings, prior));
  }
  result.steppingStages.push(...stages);
}

function presleep(...args) {
  const [settings] = args;

  return {
    target: 0,
    duration: `${settings.presleep}s`,
  };
}

function burst(...args) {
  const [settings] = args;

  const duration = settings.startStepTime || 0;
  return {
    target: settings.burstThreads,
    duration: `${duration}s`,
  };
}

function fly(...args) {
  const [settings] = args;

  return {
    target: settings.peakThreads,
    duration: `${settings.peakTime}s`,
  };
}

function start(...args) {
  const [settings] = args;
  let [, { target: last } = { target: 0 }] = args;

  const peak = settings.peakThreads;
  const increase = peak - last;
  const threads = settings.startStepThreads;
  const duration = settings.startStepTime || 0;
  const interval = settings.startStepInterval || 0;
  const count = Math.floor(increase / threads);
  const steps = [];
  for (let i = count; i > 0; i -= 1) {
    steps.push({ target: last + threads, duration: `${duration}s` });
    last += threads;
  }
  if (increase % threads) {
    steps.push({ target: peak, duration: `${duration}s` });
  }
  if (interval) {
    return interpolateStart(steps, interval);
  }
  return steps;
}

function interpolateStart(...args) {
  const [steps, interval] = args;

  if (steps.length <= 1) {
    return steps;
  }
  const interpolated = [];
  for (let i = 0; i < steps.length - 1; i += 1) {
    const step = steps[i];
    interpolated.push(step);
    interpolated.push({ target: step.target, duration: `${interval}s` });
  }
  interpolated.push(steps[steps.length - 1]);
  return interpolated;
}

function end(...args) {
  const [settings, prior] = args;

  const peak = settings.peakThreads;
  const threads = settings.stopStepThreads;
  const interval = settings.stopStepInterval || 0;
  const count = Math.ceil(peak / threads);
  const duration = count * interval;
  return { target: prior, duration: `${duration}s` };
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

module.exports = SteppingThreadGroup;
