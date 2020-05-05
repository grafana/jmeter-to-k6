const prettier = require('prettier');
const buildCompat = require('./build');
const expand = require('./expand');
const ind = require('./ind');
const paste = require('./paste');
const sort = require('./sort');
const strip = require('./strip');

/**
 * Render k6 JavaScript
 *
 * @param {ConvertResult} result - Document to render.
 *
 * @return {string} k6 script.
 */
async function render(result) {
  const [nativeImports, compatImports] = classifyImports(result);
  if (result.steppingStages) {
    appendSteppingStages(result);
  }
  if (result.steppingUser) {
    result.users.push(result.steppingUser);
  }
  const vus = countVus(result.options.stages);
  const raw = [
    renderImports(nativeImports, compatImports),
    renderConstants(result.constants),
    renderVariables(result.vars, result.state),
    renderDeclares(result.state, vus),
    renderFiles(result.files),
    renderInit(result.init),
    renderOptions(result.options),
    renderSetup(result.setup),
    renderLogic(
      result.cookies,
      result.prolog,
      result.users,
      result.options.stages,
      vus
    ),
    renderTeardown(result.teardown),
  ]
    .filter((section) => section)
    .join('\n\n');
  const main = prettier.format(raw, { semi: true, parser: 'babel' });
  const compat = await buildCompat(compatImports);
  return { main, compat };
}

function appendSteppingStages(...args) {
  const [
    {
      options: { stages },
      steppingStages,
    },
  ] = args;
  const last = stages.length ? stages[stages.length - 1].target : 0;
  steppingStages.forEach((stage) => {
    // eslint-disable-next-line no-param-reassign
    stage.target += last;
  });

  stages.push(steppingStages);
}

function countVus(stages) {
  return expand(stages).reduce((count, stage) => {
    return count + stage.target;
  }, 0);
}

function renderImports(native, compat) {
  const lines = [];
  handleNativeImports(native, lines);
  handleCompatImports(compat, lines);
  return lines.join(`\n`);
}

function classifyImports(result) {
  const native = new Map();
  const compat = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, spec] of result.imports) {
    const base = typeof spec === 'object' ? spec.base : spec;
    if (/^k6/.test(base)) {
      native.set(name, spec);
    } else {
      compat.set(name, spec);
    }
  }
  return [native, compat];
}

function handleNativeImports(native, lines) {
  const { direct, indirect } = aggregateImports(native);
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, id] of direct) {
    lines.push(`import ${name} from ${JSON.stringify(id)};`);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const id of Object.keys(indirect)) {
    const destructure = `{ ${indirect[id].join(`, `)} }`;
    lines.push(`import ${destructure} from ${JSON.stringify(id)};`);
  }
}

function aggregateImports(imports) {
  const direct = [];
  const indirect = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, spec] of imports) {
    if (typeof spec === 'object') {
      const { base } = spec;
      if (!(base in indirect)) {
        indirect[base] = [];
      }
      indirect[base].push(name);
    } else {
      direct.push([name, spec]);
    }
  }
  return { direct, indirect };
}

function handleCompatImports(compat, lines) {
  if (!compat.size) {
    return;
  }
  const entries = [...compat].map(([name]) => name).sort(sort.caseInsensitive);
  lines.push(`import {
${ind(entries.join(`,\n`))}
} from "./libs/compat.js";`);
}

function renderConstants(constants) {
  if (!constants.size) {
    return null;
  }
  const rendered = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of constants) {
    rendered[key] = renderConstant(key, value);
  }
  return `const constants = ${JSON.stringify(rendered)}`;
}

function renderConstant(key, value) {
  switch (key) {
    case 'headers':
      return renderHeaders(value);
    default:
      throw new Error(`Unrecognized constant: ${key}`);
  }
}

function renderHeaders(headers) {
  const items = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of headers) {
    items.push(`[${name}]: ${value}`);
  }
  const content = items.join(`,\n`);
  return `{ ${content} }`;
}

function renderVariables(vars, state) {
  const renderVars = state.has('vars');
  state.delete('vars');
  if (!(renderVars || vars.size)) {
    return '';
  }
  const lines = [];
  lines.push(`const vars = {}`);
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, { value, comment }] of vars) {
    let line = `vars[${JSON.stringify(name)}] = ${JSON.stringify(value)}`;

    if (comment) {
      line += ` /* ${comment} */`;
    }
    lines.push(line);
  }
  return lines.join('\n');
}

function renderFiles(files) {
  if (!files.size) {
    return null;
  }
  const lines = [];
  lines.push(`const files = {}`);

  // eslint-disable-next-line no-restricted-syntax
  for (const [path, spec] of files) {
    lines.push(renderFile(path, spec));
  }
  return lines.join('\n');
}

function renderFile(path, { binary }) {
  const params = [];
  params.push(path);
  if (binary) {
    params.push(`'b'`);
  }
  return `files[${path}] = open(${params.join(', ')})`;
}

function renderInit(init) {
  if (!init) {
    return '';
  }
  return strip(init);
}

function renderDeclares(state, vus) {
  const lines = [];
  if (state.has('vus')) {
    lines.push(`const vus = ${vus}`);
    state.delete('vus');
  }
  lines.push(renderObjectState(state));
  lines.push(renderState(state));
  return lines.filter((line) => line).join('\n');
}

function renderObjectState(state) {
  const items = [];
  if (state.has('csvPage')) {
    items.push(`csvPage`);
    state.delete('csvPage');
  }
  if (state.has('csvColumns')) {
    items.push('csvColumns');
    state.delete('csvColumns');
  }
  if (!items.length) {
    return '';
  }
  return `let ${items.map((item) => `${item} = {}`).join(', ')}`;
}

function renderState(state) {
  if (!state.size) {
    return '';
  }
  return `let ${[...state].join(', ')}`;
}

function renderOptions(options) {
  const keys = Object.keys(options);
  if (!keys.length) {
    return '';
  }
  const sections = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    sections.push(renderOption(options, key));
  }
  return `export let options = {
${ind(sections.join(',\n'))}
}`;
}

function renderOption(options, key) {
  switch (key) {
    case 'hosts':
      return `hosts: ${renderHosts(options.hosts)}`;
    case 'stages':
      return `stages: ${JSON.stringify(expand(options.stages), '', 2)}`;
    case 'noVUConnectionReuse':
      return options.noVUConnectionReuse ? 'noVUConnectionReuse: true' : '';
    default:
      throw new Error(`Unrecognized option: ${key}`);
  }
}

function renderHosts(hosts) {
  const items = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of Object.entries(hosts)) {
    items.push(`[${name}]: ${value}`);
  }
  const content = items.join(`,\n`);
  return `{ ${content} }`;
}

function renderSetup(setup) {
  if (!setup) {
    return '';
  }
  return `export function setup () {
${ind(strip(setup))}
}`;
}

function renderLogic(cookies, prolog, users, stages, _vus) {
  const sections = [];
  for (let i = 0; i < users.length; i += 1) {
    const [start, end] = userRange(i, stages);
    const logic = users[i];
    sections.push(`if (__VU >= ${start} && __VU <= ${end}) {
${ind(strip(logic))}
}`);
  }
  const main =
    // eslint-disable-next-line no-nested-ternary
    (stages.length === 0
      ? ''
      : stages.length === 1
      ? users[0]
      : sections.join(` else `)) || '';
  const body = [strip(renderCookies(cookies)), strip(prolog), strip(main)]
    .filter((item) => item)
    .join(`\n\n`);
  return `export default function (data) {
${ind(strip(body))}
}`;
}

function renderCookies(cookies) {
  if (!cookies.size) {
    return '';
  }
  const rendered = [`const jar = http.cookieJar()`];

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, spec] of cookies) {
    rendered.push(renderCookie(name, spec));
  }
  return rendered.join('\n');
}

function renderCookie(name, spec) {
  const address = renderCookieAddress(spec);
  const attributes = renderCookieAttributes(spec);
  return (
    `jar.set(${address}` +
    `, ${JSON.stringify(name)}` +
    `, ${spec.value}` +
    `, ${attributes})`
  );
}

function renderCookieAddress(spec) {
  const protocol = spec.secure ? 'https' : 'http';
  const scheme = `${protocol}://`;
  const { domain } = spec;
  const path = spec.path || null;
  return paste(JSON.stringify(scheme), domain, path);
}

function renderCookieAttributes(spec) {
  const items = [];
  if (spec.domain) {
    items.push(`domain: ${spec.domain}`);
  }
  if (spec.path) {
    items.push(`path: ${spec.path}`);
  }
  if ('secure' in spec) {
    items.push(`secure: ${spec.secure}`);
  }
  const content = items.join(`, `);
  return `{ ${content} }`;
}

function userRange(i, stages) {
  const low = userLow(i, stages);
  const high = userHigh(i, stages);
  return [low, high];
}
function userLow(i, stages) {
  if (i === 0) {
    return stages[i].target ? 1 : 0;
  }
  return stages[i - 1].target + 1;
}
function userHigh(i, stages) {
  const stage = stages[i];
  if (Array.isArray(stage)) {
    return stage.reduce(peakThreads, 0);
  }
  return stage.target;
}
function peakThreads(peak, item) {
  return Math.max(peak, item.target);
}

function renderTeardown(teardown) {
  if (!teardown) {
    return '';
  }
  return `export function teardown (data) {
${ind(strip(teardown))}
}`;
}

module.exports = render;
