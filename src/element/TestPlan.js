const variables = require('../common/variables')
const merge = require('../merge')
const elements = require('../elements')
const text = require('../text')
const makeResult = require('../result')

function TestPlan (node, defaults = []) {
  const result = makeResult()
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els, defaults))
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass':
    case 'testclass':
    case 'enabled':
      break
    case 'testname': {
      const name = node.attributes[key]
      result.init += '// ' + name
      break
    }
    default: throw new Error('Unrecognized TestPlan attribute: ' + key)
  }
}

function property (node, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments': {
      const comments = text(node.children)
      result.init += `

/*
${comments}
*/`
      break
    }
    case 'user_defined_variables': {
      const collection = node.children.find(
        item => item.name === 'collectionProp'
      )
      const variablesResult = variables(collection)
      merge(result, variablesResult)
      break
    }
    default: throw new Error('Unrecognized TestPlan property: ' + name)
  }
}

module.exports = TestPlan
