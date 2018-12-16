import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import empty from 'helper/empty'
import document from 'document'

test.serial('empty', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935"/>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result, empty)
})

test.serial('children', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <Fake/>
  <Fake/>
  <Fake/>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `// Fake
// Fake
// Fake
`)
})
