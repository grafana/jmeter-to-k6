import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import jmeterTestPlan from 'sink/element/jmeterTestPlan'
import document from 'document'

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
