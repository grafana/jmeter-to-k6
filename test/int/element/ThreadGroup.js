import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('minimal', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">1</stringProp>
        <stringProp name="ThreadGroup.ramp_time">2</stringProp>
      </ThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options, { stages: [ { duration: '2s', target: 1 } ] })
  t.deepEqual(result.users, [ '' ])
})

test('multiple', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">1</stringProp>
        <stringProp name="ThreadGroup.ramp_time">2</stringProp>
      </ThreadGroup>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">3</stringProp>
        <stringProp name="ThreadGroup.ramp_time">4</stringProp>
      </ThreadGroup>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">5</stringProp>
        <stringProp name="ThreadGroup.ramp_time">6</stringProp>
      </ThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(
    result.options,
    { stages: [
      { target: 1, duration: '2s' },
      { target: 4, duration: '4s' },
      { target: 9, duration: '6s' }
    ] }
  )
  t.deepEqual(result.users, [ '', '', '' ])
})

test('iterations', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">1</stringProp>
        <stringProp name="ThreadGroup.ramp_time">2</stringProp>
        <elementProp name="main_controller">
          <intProp name="loops">50</intProp>
        </elementProp>
      </ThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.users[0], `if (__ITER < 50) {

}`)
})
