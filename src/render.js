const expand = require('./expand')
const ind = require('./ind')

/**
 * Render k6 JavaScript
 *
 * @param {ConvertResult} result - Document to render.
 *
 * @return {string} k6 script.
 */
function render (result) {
  return [
    renderInit(result.init),
    renderConstants(result.constants),
    renderOptions(result.options),
    renderSetup(result.setup),
    renderLogic(
      result.cookies,
      result.prolog,
      result.users,
      result.options.stages
    ),
    renderTeardown(result.teardown)
  ].filter(section => section).join('\n\n')
}

function renderInit (init) {
  if (!init) return ''
  else return init
}

function renderConstants (constants) {
  const rendered = {}
  for (const [ key, value ] of constants) {
    rendered[key] = renderConstant(key, value)
  }
  return `const constants = ${JSON.stringify(rendered)}`
}

function renderConstant (key, value) {
  switch (key) {
    case 'headers': return renderHeaders(value)
    default: throw new Error('Unrecognized constant: ' + key)
  }
}

function renderHeaders (headers) {
  const entries = {}
  for (const [ key, value ] of headers) entries[key] = value
  return entries
}

function renderOptions (options) {
  const keys = Object.keys(options)
  if (!keys.length) return ''
  const sections = []
  for (const key of keys) sections.push(renderOption(options, key))
  return `export let options = {
${ind(sections.join(',\n'))}
}`
}

function renderOption (options, key) {
  switch (key) {
    case 'hosts': return JSON.stringify(options.hosts)
    case 'stages': return JSON.stringify(expand(options.stages))
    default: throw new Error('Unrecognized option: ' + key)
  }
}

function renderSetup (setup) {
  if (!setup) return ''
  return `export function setup () {
${ind(setup)}
}`
}

function renderLogic (cookies, prolog, users, stages) {
  const sections = []
  for (let i = 0; i < users.length; i++) {
    const [ start, end ] = userRange(i, stages)
    const logic = users[i]
    sections.push(`if (__VU >= ${start} && __VU <= ${end}) {
${ind(logic)}
}`)
  }
  sections.push(`throw new Error('Unexpected VU: ' + __VU)`)
  const main = sections.join(` else `)
  const body = [
    renderCookies(cookies),
    prolog,
    main
  ].filter(item => item).join('\n\n')
  return `export default function (data) {
${ind(body)}
}`
}

function renderCookies (cookies) {
  if (!cookies.size) return ''
  const rendered = [ `const jar = http.cookieJar()` ]
  for (const [ name, spec ] of cookies) rendered.push(renderCookie(name, spec))
  return rendered.join('\n')
}

function renderCookie (name, spec) {
  const address =
    'http' + (spec.secure ? 's' : '') + '://' +
    spec.domain +
    (spec.path || '')
  const attributes = {}
  if (spec.domain) attributes.domain = spec.domain
  if (spec.path) attributes.path = spec.path
  if ('secure' in spec) attributes.secure = spec.secure
  return (
    `jar.set(${JSON.stringify(address)}` +
    `, ${JSON.stringify(name)}` +
    `, ${JSON.stringify(spec.value)}` +
    `, ${JSON.stringify(attributes)})`
  )
}

function userRange (i, stages) {
  const start = stages.slice(0, i).reduce(sumStageThreads, 0) + 1
  const end = start + threads(stages[i]) - 1
  return [ start, end ]
}
function sumStageThreads (total, stage) { return (total + threads(stage)) }
function threads (stage) {
  return Array.isArray(stage) ? stage.reduce(sumStepThreads, 0) : stage.target
}
function sumStepThreads (total, item) { return (total + item.target) }

function renderTeardown (teardown) {
  if (!teardown) return ''
  return `export function teardown (data) {
${ind(teardown)}
}`
}

module.exports = render
