import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import TransactionController from 'element/TransactionController'

test('convert', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<TransactionController testname="Group1">
  <boolProp name="includeTimers">true</boolProp>
  <Fake/>
  <Fake/>
  <Fake/>
</TransactionController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = TransactionController(node)
  t.is(result.logic, `

group("Group1", () => {
  // Fake
  // Fake
  // Fake
})`)
})
