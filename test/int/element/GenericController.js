import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import GenericController from 'element/GenericController'

test('convert', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<GenericController testname="Group1">
  <Fake/>
  <Fake/>
  <Fake/>
</GenericController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = GenericController(node)
  t.is(result.logic, `

k6.group("Group1", () => {
  // Fake
  // Fake
  // Fake
})`)
})
