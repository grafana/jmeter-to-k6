const match = require('./match')

const left = '(?:^|\\\\\\\\|[^\\\\])\\${'
const right = '}'

// Render runtime string
function render (string) {
  const ranges = match(string, left, right, 'g')
  if (!ranges.length) return `\`${string.replace('`', '\\`')}\``
  const values = ranges.map(range => replace(string, range))
  for (let i = ranges.length - 1; i > -1; i--) {
    const [ start, end ] = ranges[i]
    const value = values[i]
    string = splice(string, start, end, value)
  }
  return `\`${string}\``
}

function replace (string, [ start, end ]) {
  return evaluate(string.substring(start + 2, end - 1))
}

function evaluate (string) {
  if (string === '') return ''
  else if (string.substring(0, 2) === '__') return func(string)
  else return variable(string)
}

function func (string) {
  throw new Error('JMeter functions not implemented')
}

function variable (name) {
  return `vars[${render(name)}]`
}

function splice (string, start, end, substitute) {
  const lead = string.substring(0, start)
  const tail = string.substring(end)
  return [ lead, '${', substitute, '}', tail ].join('')
}

module.exports = render
