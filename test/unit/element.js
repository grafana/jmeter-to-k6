import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'

const jmeterTestPlan = sinon.spy()
mockRequire('element/jmeterTestPlan', jmeterTestPlan)
const element = require('element')

test.beforeEach(t => {
  jmeterTestPlan.resetHistory()
})

test.serial('unrecognized', t => {
  const node = { name: 'BadElement' }
  t.throws(() => {
    element(node)
  }, /Unrecognized element: /)
})

test.serial('jmeterTestPlan', t => {
  const node = { name: 'jmeterTestPlan' }
  element(node)
  t.true(jmeterTestPlan.calledOnce)
})
