import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'

const merge = sinon.spy()
mockRequire('merge', merge)
const element = sinon.spy()
mockRequire('element', element)
const elements = require('elements')

test.beforeEach(t => {
  merge.resetHistory()
  element.resetHistory()
})

test.serial('element 0', t => {
  elements([])
  t.true(element.notCalled)
})

test.serial('element 1', t => {
  elements([ {} ])
  t.true(element.calledOnce)
})

test.serial('element 3', t => {
  elements([ {}, {}, {} ])
  t.true(element.calledThrice)
})

test.serial('merge 0', t => {
  elements([])
  t.true(merge.notCalled)
})

test.serial('merge 1', t => {
  elements([ {} ])
  t.true(merge.calledOnce)
})

test.serial('merge 3', t => {
  elements([ {}, {}, {} ])
  t.true(merge.calledThrice)
})

test.serial('return', t => {
  const result = elements([])
  t.is(typeof result, 'object')
})
