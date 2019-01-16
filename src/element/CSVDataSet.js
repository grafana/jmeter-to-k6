const value = require('../value')
const makeResult = require('../result')

function CSVDataSet (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
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
    case 'shareMode':
      settings.share = value(node, context).split('.').pop()
      break
    case 'stopThread':
      settings.stopThread = (value(node, context) === 'true')
      break
    case 'variableNames':
      settings.names = value(node, context).split(',')
      break
    default: throw new Error('Unrecognized CSVDataSet property: ' + name)
  }
}

module.exports = CSVDataSet
