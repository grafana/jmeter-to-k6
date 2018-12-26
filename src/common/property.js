module.exports = (...args) => { return property(...args) }

const text = require('../text')
const properties = require('./properties')

function property (node) {
  const name = node.attributes.name.split('.').pop()
  return { [name]: extractValue(node) }
}

function extractValue (node) {
  const type = node.name.split('Prop')[0]
  const encoded = text(node.children)
  switch (type) {
    case 'bool': return decodeBool(encoded)
    case 'element': return extractElement(node)
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

function extractElement (node) {
  const type = node.attributes.elementType
  if (type === 'Arguments') return extractArguments(node)
  else throw new Error('Unrecognized elementProp type: ' + type)
}

function extractArguments (node) {
  const collection = node.children.find(item => item.name === 'collectionProp')
  const elements = collection.children.filter(
    item => item.type === 'element' && item.name.endsWith('Prop')
  )
  return elements.map(element => properties(element))
}
