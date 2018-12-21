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
    renderLogic(result.prolog, result.users),
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
  ${sections.join('\n')}
}`
}

function renderOption (options, key) {
  switch (key) {
    case 'stages': {
      const stages = options[key]
      return '  stages: ' + JSON.stringify(stages, 4)
    }
    default: throw new Error('Unrecognized option: ' + key)
  }
}

function renderSetup (setup) {
  if (!setup) return ''
  return `export function setup () {
  ${setup}
}`
}

function renderLogic (prolog, users) {
  const sections = []
  for (let i = 0; i < users.length; i++) {
    const number = i + 1
    const logic = users[i]
    sections.push(`    case ${number}:
      ${logic}
      break`)
  }
  const branch = `  switch (__VU) {
${sections.join('\n')}
    default: throw new Error('Unexpected VU: ' + __VU)
  }`
  const body = [
    prolog,
    branch
  ].filter(item => item).join('\n\n')
  return `export default function (data) {
${body}
}`
}

function renderTeardown (teardown) {
  if (!teardown) return ''
  return `export function teardown (data) {
  ${teardown}
}`
}

module.exports = render
