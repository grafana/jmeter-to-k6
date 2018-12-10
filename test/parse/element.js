import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'
import parseXml from '@rgrove/parse-xml'

const jmeterTestPlan = sinon.spy()
mockRequire('element/jmeterTestPlan', jmeterTestPlan)
const document = require('document')

test.beforeEach(t => {
  jmeterTestPlan.resetHistory()
})

test.serial('jmeterTestPlan', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935"/>
`
  const tree = parseXml(xml)
  document(tree)
  t.true(jmeterTestPlan.calledOnce)
})
