import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('comment', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="ThreadGroup.comments">Step up to load</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.prolog, `

/*
Step up to load
*/`)
})

test('stages even', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="Start users period">2000</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '2000ms' },
    { target: 2, duration: '2000ms' },
    { target: 2, duration: '2000ms' },
    { target: 2, duration: '2000ms' },
    { target: 2, duration: '2000ms' }
  ] ])
})

test('stages odd', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">11</stringProp>
        <stringProp name="Start users count">3</stringProp>
        <stringProp name="Start users period">2000</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 3, duration: '2000ms' },
    { target: 3, duration: '2000ms' },
    { target: 3, duration: '2000ms' },
    { target: 2, duration: '2000ms' }
  ] ])
})
