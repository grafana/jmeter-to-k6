const variables = require('../common/variables')
const merge = require('../merge')
const elements = require('../elements')
const value = require('../value')
const makeResult = require('../result')
const makeContext = require('../context')

function TestPlan (node, context = makeContext()) {
  const result = makeResult()
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, result)
  const els = node.children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els, context))
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

function property (node, context, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments': {
      const comments = value(node, context)
      result.init += `

/* ${comments} */`
      break
    }
    case 'user_defined_variables': {
      const collection = node.children.find(
        item => item.name === 'collectionProp'
      )
      const variablesResult = variables(collection, context)
      merge(result, variablesResult)
      break
    }
    default: throw new Error('Unrecognized TestPlan property: ' + name)
  }
}

module.exports = TestPlan
