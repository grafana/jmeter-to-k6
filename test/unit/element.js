import test from 'ava'
import jmeterTestPlan from 'sink/element/jmeterTestPlan'
import element from 'element'

test.beforeEach(t => {
  jmeterTestPlan.resetHistory()
})

test.serial('unrecognized', t => {
  const node = { name: 'BadElement', children: [] }
  t.throws(() => {
    element(node)
  }, /Unrecognized element: /)
})

test.serial('jmeterTestPlan', t => {
  const node = { name: 'jmeterTestPlan', children: [] }
  element(node)
  t.true(jmeterTestPlan.calledOnce)
})
