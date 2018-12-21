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
    renderSetup(result.setup)
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

module.exports = render
