const merge = require('../merge')
const elements = require('../elements')
const text = require('../text')

function TestPlan (node) {
  const result = { options: {}, logic: '' }
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const children = node.children
  const props = children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, result)
  const els = children.filter(node => !/Prop$/.test(node.name))
  merge(result, elements(els))
  return result
}

function attribute (node, key, result) {
  switch (key) {
    case 'guiclass': break
    case 'testclass': break
    case 'enabled': break
    case 'testname':
      const name = node.attributes[key]
      result.logic += '// ' + name + '\n'
      break
    default: throw new Error('Unrecognized TestPlan attribute: ' + key)
  }
}

function property (node, result) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'comments':
      const comments = text(node.children)
      result.logic += `
/*
${comments}
*/
`
      break
    default: throw new Error('Unrecognized TestPlan property: ' + name)
  }
}

module.exports = TestPlan