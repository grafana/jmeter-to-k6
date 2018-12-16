import test from 'ava'
import elements from 'sink/elements'
import hashTree from 'element/hashTree'

test.beforeEach(t => {
  elements.resetHistory()
})

test('elements', t => {
  const node = { children: Symbol('TestToken') }
  hashTree(node)
  t.true(elements.calledOnce)
  t.is(elements.firstCall.args[0], node.children)
})
