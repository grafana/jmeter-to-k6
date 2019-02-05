import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import LoopController from 'element/LoopController'

test('infinite', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<LoopController>
  <boolProp name="continue_forever">true</boolProp>
  <Fake/>
  <Fake/>
  <Fake/>
</LoopController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = LoopController(node)
  t.is(result.logic, `

{ let first = true; while (true) {
  // Fake
  // Fake
  // Fake
  first = false
} }`)
})

test('finite', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<LoopController>
  <intProp name="loops">18</intProp>
  <Fake/>
  <Fake/>
  <Fake/>
</LoopController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = LoopController(node)
  t.is(result.logic, `

for (let i = 0, first = true; i <= 18; i++) {
  // Fake
  // Fake
  // Fake
  first = false
}`)
})
