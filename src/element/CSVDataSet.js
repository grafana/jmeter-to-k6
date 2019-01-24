const value = require('../value')
const makeResult = require('../result')

function CSVDataSet (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (sufficient(settings)) render(settings, context, result)
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized CSVDataSet attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'delimiter':
      settings.delimiter = value(node, context).replace('\\t', '\t')
      break
    case 'fileEncoding':
      settings.encoding = value(node, context)
      break
    case 'filename':
      settings.path = value(node, context)
      break
    case 'ignoreFirstLine':
      settings.skip1 = (value(node, context) === 'true')
      break
    case 'quotedData':
      settings.quoted = (value(node, context) === 'true')
      break
    case 'recycle':
      settings.recycle = (value(node, context) === 'true')
      break
    case 'shareMode': {
      const share = value(node, context).split('.').pop()
      if (share !== 'all') {
        throw new Error('Unsupported sharing mode: ' + share)
      }
      break
    }
    case 'stopThread': {
      const stopThread = (value(node, context) === 'true')
      if (stopThread) throw new Error('k6 does not support stopping thread')
      break
    }
    case 'variableNames':
      settings.names = value(node, context).split(',')
      break
    default: throw new Error('Unrecognized CSVDataSet property: ' + name)
  }
}

function sufficient (settings) {
  return (
    settings.delimiter &&
    settings.path
  )
}

function render (settings, context, result) {
  const { path: rawPath } = settings
  const path = JSON.stringify(rawPath)
  const options = { delimiter: settings.delimiter }
  options.quote = (settings.quoted ? '"' : null)
  const customNames = (settings.names && settings.names.length)
  if (!customNames && settings.skip1) options['from_line'] = 2
  options.columns = (customNames ? settings.names : true)
  result.imports.set('buffer', './build/buffer.js')
  result.imports.set('csvParse', './build/csv-parse.js')
  result.files.set(rawPath, { path: settings.path, binary: true })
  const file = `files[${path}]`
  result.init = `

${file} = buffer.Buffer.from(${file}).toString(${renderEncoding(settings)})
${file} = csvParse(${file}, ${JSON.stringify(options)})
csvPage[${path}] = 0`
  renderRead(settings, result, path, file)
}

function renderEncoding (settings) {
  const { fileEncoding: encoding } = settings
  if (!encoding) return `'utf8'`
  switch (encoding) {
    case 'UTF-8': return `'utf8'`
    case 'UTF-16': return `'utf16le'`
    case 'US-ASCII': return `'ascii'`
    default: throw new Error('Unsupported encoding: ' + encoding)
  }
}

function renderRead (settings, result, path, file) {
  if (settings.recycle) renderRotate(result, path, file)
  else renderLimited(result, path, file)
}

function renderRotate (result, path, file) {
  const page = `csvPage[path]`
  result.prolog += `

{
  // Read CSV line: ${path}
  // NOTE: In JMeter all Virtual Users (aka Threads) can read from the same CSVDataSet.
  // In k6 there's no data sharing between VUs. Instead you can use the __VU global variable
  // to help partition the data (if running in the Load Impact cloud you'll also have to
  // use LI_INSTANCE_ID).
  const path = ${path}
  const file = files[path]
  let index = (${page} * vus) + __VU - 1
  if (index >= file.length) {
    if (!${page}) throw new Error('Missing CSV data for VU ' + __VU)
    index = __VU - 1
    ${page} = 1
  } else ${page}++
  const record = file[index]
  for (const key of Object.keys(record)) vars[key] = record[key]
}`
}

function renderLimited (result, path, file) {
  const page = `csvPage[path]`
  result.prolog += `

{
  // Read CSV line: ${path}
  // NOTE: In JMeter all Virtual Users (aka Threads) can read from the same CSVDataSet.
  // In k6 there's no data sharing between VUs. Instead you can use the __VU global variable
  // to help partition the data (if running in the Load Impact cloud you'll also have to
  // use LI_INSTANCE_ID).
  const path = ${path}
  const file = files[path]
  if (${page} !== null) {
    const index = (${page} * vus) + __VU - 1
    if (index >= file.length) {
      ${page} = null
      const keys = file[0]
      if (keys) for (const key of Object.keys(keys)) vars[key] = '<EOF>'
    } else {
      const record = file[index]
      for (const key of Object.keys(record)) vars[key] = record[key]
      ${page}++
    }
  }
}`
}

module.exports = CSVDataSet
