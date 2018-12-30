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
    renderOptions(result.options),
    renderSetup(result.setup),
    renderLogic(result.prolog, result.users, result.options.stages),
    renderTeardown(result.teardown)
  ].filter(section => section).join('\n\n')
}

function renderInit (init) {
  if (!init) return ''
  else return init
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
    case 'stages': {
      const stages = options[key]
      return 'stages: ' + JSON.stringify(expand(stages), 4)
    }
    default: throw new Error('Unrecognized option: ' + key)
  }
}

function renderSetup (setup) {
  if (!setup) return ''
  return `export function setup () {
${ind(setup)}
}`
}

function renderLogic (prolog, users, stages) {
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
    prolog,
    main
  ].filter(item => item).join('\n\n')
  return `export default function (data) {
${ind(body)}
}`
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
