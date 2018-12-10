import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'
import parseXml from '@rgrove/parse-xml'

const element = sinon.spy()
mockRequire('element', element)
const document = require('document')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935"/>
`

test.beforeEach(t => {
  element.resetHistory()
  t.context.tree = parseXml(xml)
})

test('element', t => {
  document(t.context.tree)
  t.true(element.calledOnce)
})
