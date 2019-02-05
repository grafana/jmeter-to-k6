import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'

const elements = sinon.spy()
mockRequire('elements', elements)
const jmeterTestPlan = require('element/jmeterTestPlan')

test.beforeEach(t => {
  elements.resetHistory()
})

test.serial('elements', t => {
  const node = { children: Symbol('TestToken') }
  jmeterTestPlan(node)
  t.true(elements.calledOnce)
  t.is(elements.firstCall.args[0], node.children)
})
