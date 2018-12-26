const text = require('./text')

function property (node) {
  const name = node.attributes.name.split('.').pop()
  return { [name]: extractValue(node) }
}

function extractValue (node) {
  const type = node.name.split('Prop')[0]
  const encoded = text(node.children)
  switch (type) {
    case 'bool': return decodeBool(encoded)
    case 'string': return decodeString(encoded)
    default: throw new Error('Unrecognized property type: ' + type)
  }
}

function decodeBool (value) {
  switch (value) {
    case 'true': return true
    case 'false': return false
    case '': return null
    default: throw new Error('Unrecognized boolProp value: ' + value)
  }
}

function decodeString (value) { return value || null }

module.exports = property
