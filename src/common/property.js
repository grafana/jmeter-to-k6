module.exports = (...args) => { return property(...args) }

const properties = require('./properties')
const value = require('../value')

function property (node, context) {
  const name = node.attributes.name.split('.').pop()
  return { [name]: extractValue(node, context) }
}

function extractValue (node, context) {
  const type = node.name.split('Prop')[0]
  const encoded = value(node, context)
  switch (type) {
    case 'bool': return decodeBool(encoded)
    case 'element': return extractElement(node, context)
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

function extractElement (node, context) {
  const type = node.attributes.elementType
  if (type === 'Arguments') return extractArguments(node)
  else throw new Error('Unrecognized elementProp type: ' + type)
}

function extractArguments (node, context) {
  const collection = node.children.find(item => item.name === 'collectionProp')
  const elements = collection.children.filter(
    item => item.type === 'element' && item.name.endsWith('Prop')
  )
  return elements.map(element => properties(element, context))
}
