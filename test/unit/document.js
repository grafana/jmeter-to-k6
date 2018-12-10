import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'

const element = sinon.stub()
mockRequire('element', element)
const document = require('document')

const tree = {
  type: 'document',
  children: [
    {
      type: 'element',
      name: 'jmeterTestPlan',
      children: []
    }
  ]
}

test.beforeEach(t => {
  element.reset()
})

test('root', t => {
  document(tree)
  t.true(element.calledOnce)
  t.deepEqual(element.firstCall.args[0], tree.children[0])
})

test('return', t => {
  const token = Symbol('TestToken')
  element.returns(token)
  const result = document(tree)
  t.is(result, token)
})
