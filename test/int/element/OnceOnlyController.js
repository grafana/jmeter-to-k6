import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'
import OnceOnlyController from 'element/OnceOnlyController'

test('test', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OnceOnlyController>
  <Fake/>
  <Fake/>
  <Fake/>
</OnceOnlyController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = OnceOnlyController(node)
  t.is(result.logic, `

if (__ITER === 0) {
  // Fake
  // Fake
  // Fake
}`)
})

test('loop', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<LoopController>
  <boolProp name="continue_forever">true</boolProp>
  <OnceOnlyController>
    <Fake/>
    <Fake/>
    <Fake/>
  </OnceOnlyController>
</LoopController>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

{ let first = true; while (true) {
  if (first) {
    // Fake
    // Fake
    // Fake
  }
  first = false
} }`)
})
