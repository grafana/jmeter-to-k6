import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import element from 'sink/element'
import document from 'document'

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935"/>
`

test.beforeEach(t => {
  element.resetHistory()
  t.context.tree = parseXml(xml)
})

test.serial('element', t => {
  document(t.context.tree)
  t.true(element.calledOnce)
})
