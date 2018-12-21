/**
 * Render k6 JavaScript
 *
 * @param {ConvertResult} result - Document to render.
 *
 * @return {string} k6 script.
 */
function render (result) {
  return (
    renderOptions(result.options)
  )
}

function renderOptions (options) {
  const keys = Object.keys(options)
  if (!keys.length) return ''
  let script = 'export let options = {\n'
  for (const key of keys) script += renderOption(options, key)
  script += '}\n'
  return script
}

function renderOption (options, key) {
  switch (key) {
    case 'stages': {
      const stages = options[key]
      return '  stages: ' + JSON.stringify(stages, 4) + '\n'
    }
    default: throw new Error('Unrecognized option: ' + key)
  }
}

module.exports = render
