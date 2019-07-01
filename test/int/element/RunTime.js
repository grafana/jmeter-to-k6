import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('foreach', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <RunTime>
    <stringProp name="seconds">5</stringProp>
    <ForeachController>
      <stringProp name="inputVal">input</stringProp>
      <stringProp name="returnVal">output</stringProp>
      <boolProp name="useSeparator">true</boolProp>
      <stringProp name="startIndex">5</stringProp>
      <stringProp name="endIndex">500</stringProp>
      <Fake/>
      <Fake/>
      <Fake/>
    </ForeachController>
  </RunTime>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

{
  const deadline = Date.now() + 5000
  for (let i = 5, first = true; i <= 500; i++) {
    vars["output"] = vars["input" + "_" + i]
    // Fake
    // Fake
    // Fake
    first = false
    if (Date.now() >= deadline) break
  }
}`)
})

test('loop', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <RunTime>
    <stringProp name="seconds">5</stringProp>
    <LoopController>
      <boolProp name="continue_forever">true</boolProp>
      <Fake/>
      <Fake/>
      <Fake/>
    </LoopController>
  </RunTime>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

{
  const deadline = Date.now() + 5000
  { let first = true; while (true) {
    // Fake
    // Fake
    // Fake
    first = false
    if (Date.now() >= deadline) break
  } }
}`)
})

test('while', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <RunTime>
    <stringProp name="seconds">5</stringProp>
    <WhileController>
      <stringProp name="condition">true</stringProp>
      <Fake/>
      <Fake/>
      <Fake/>
    </WhileController>
  </RunTime>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

{
  const deadline = Date.now() + 5000
  { let first = true; while ("true" !== "false") {
    // Fake
    // Fake
    // Fake
    first = false
    if (Date.now() >= deadline) break
  } }
}`)
})
