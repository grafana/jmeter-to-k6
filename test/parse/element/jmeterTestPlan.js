import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'
import parseXml from '@rgrove/parse-xml'

const elements = sinon.spy()
mockRequire('elements', elements)
const document = require('document')

test.beforeEach(t => {
  elements.resetHistory()
})

test.serial('children', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree/>
  <hashTree/>
  <hashTree/>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  document(tree)
  t.true(elements.calledOnce)
  t.is(elements.firstCall.args[0].length, 3 + 4) // 3 elements, 4 text nodes
})
