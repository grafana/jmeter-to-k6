import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import ForeachController from 'element/ForeachController'

test('separated', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ForeachController>
  <stringProp name="inputVal">input</stringProp>
  <stringProp name="returnVal">output</stringProp>
  <boolProp name="useSeparator">true</boolProp>
  <stringProp name="startIndex">3</stringProp>
  <stringProp name="endIndex">15</stringProp>
</ForeachController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ForeachController(node)
  t.is(result.logic, `

for (let i = 3, first = true; i <= 15; i++) {
  vars["output"] = vars["input_" + i]

  first = false
}`)
})

test('unseparated', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ForeachController>
  <stringProp name="inputVal">input</stringProp>
  <stringProp name="returnVal">output</stringProp>
  <boolProp name="useSeparator">false</boolProp>
  <stringProp name="startIndex">3</stringProp>
  <stringProp name="endIndex">15</stringProp>
</ForeachController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ForeachController(node)
  t.is(result.logic, `

for (let i = 3, first = true; i <= 15; i++) {
  vars["output"] = vars["input" + i]

  first = false
}`)
})
