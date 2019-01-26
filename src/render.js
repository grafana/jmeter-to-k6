const prettier = require('prettier')
const expand = require('./expand')
const ind = require('./ind')
const strip = require('./strip')

/**
 * Render k6 JavaScript
 *
 * @param {ConvertResult} result - Document to render.
 *
 * @return {string} k6 script.
 */
function render (result) {
  const vus = countVus(result.options.stages)
  const raw = [
    renderImports(result.imports),
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
    renderTeardown(result.teardown)
  ].filter(section => section).join('\n\n')
  return prettier.format(raw, { semi: false, parser: 'babel' })
}

function countVus (stages) {
  return expand(stages).reduce(
    (count, stage) => { return count + stage.target },
    0
  )
}

function renderImports (imports) {
  const directImports = []
  const indirectImports = {}
  for (const [ name, spec ] of imports) {
    if (typeof spec === 'object') {
      const { base } = spec
      if (!(base in indirectImports)) indirectImports[base] = []
      indirectImports[base].push(name)
    } else directImports.push([ name, spec ])
  }
  const lines = []
  for (const [ name, path ] of directImports) {
    lines.push(renderImport(name, path))
  }
  for (const key of Object.keys(indirectImports)) {
    const name = `{ ${indirectImports[key].join(', ')} }`
    lines.push(renderImport(name, key))
  }
  return lines.join(`\n`)
}

function renderImport (name, path) {
  return `import ${name} from ${JSON.stringify(path)}`
}

function renderConstants (constants) {
  if (!constants.size) return null
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

function renderVariables (vars, state) {
  const renderVars = state.has('vars')
  state.delete('vars')
  if (!(renderVars || vars.size)) return ''
  const lines = []
  lines.push(`const vars = {}`)
  for (const [ name, { value, comment } ] of vars) {
    let line = `vars[${JSON.stringify(name)}] = ${JSON.stringify(value)}`
    if (comment) line += ` /* ${comment} */`
    lines.push(line)
  }
  return lines.join('\n')
}

function renderFiles (files) {
  if (!files.size) return null
  const lines = []
  lines.push(`const files = {}`)
  for (const [ name, spec ] of files) lines.push(renderFile(name, spec))
  return lines.join('\n')
}

function renderFile (name, { path, binary }) {
  const params = []
  params.push(JSON.stringify(path))
  if (binary) params.push(`'b'`)
  return `files[${JSON.stringify(name)}] = open(${params.join(', ')})`
}

function renderInit (init) {
  if (!init) return ''
  else return strip(init)
}

function renderDeclares (state, vus) {
  const lines = []
  if (state.has('vus')) {
    lines.push(`const vus = ${vus}`)
    state.delete('vus')
  }
  lines.push(renderObjectState(state))
  lines.push(renderState(state))
  return lines.filter(line => line).join('\n')
}

function renderObjectState (state) {
  const items = []
  if (state.has('csvPage')) {
    items.push(`csvPage`)
    state.delete('csvPage')
  }
  if (state.has('csvColumns')) {
    items.push('csvColumns')
    state.delete('csvColumns')
  }
  if (!items.length) return ''
  return 'let ' + items.map(item => item + ' = {}').join(', ')
}

function renderState (state) {
  if (!state.size) return ''
  return 'let ' + [ ...state ].join(', ')
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
    case 'hosts': return `hosts: ${JSON.stringify(options.hosts)}`
    case 'stages': return `stages: ${JSON.stringify(expand(options.stages))}`
    default: throw new Error('Unrecognized option: ' + key)
  }
}

function renderSetup (setup) {
  if (!setup) return ''
  return `export function setup () {
${ind(strip(setup))}
}`
}

function renderLogic (cookies, prolog, users, stages, vus) {
  const sections = []
  for (let i = 0; i < users.length; i++) {
    const [ start, end ] = userRange(i, stages)
    const logic = users[i]
    sections.push(`if (__VU >= ${start} && __VU <= ${end}) {
${ind(strip(logic))}
}`)
  }
  const main = (stages.length === 1 ? '' : sections.join(` else `))
  const body = [
    strip(renderCookies(cookies)),
    strip(prolog),
    strip(main)
  ].filter(item => item).join('\n\n')
  return `export default function (data) {
${ind(strip(body))}
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
${ind(strip(teardown))}
}`
}

module.exports = render
