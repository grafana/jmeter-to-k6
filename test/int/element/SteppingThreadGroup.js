import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('comment', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="ThreadGroup.comments">Step up to load</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.prolog, `

/* Step up to load */`)
})

test('basic', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '0s' },
    { target: 4, duration: '0s' },
    { target: 6, duration: '0s' },
    { target: 8, duration: '0s' },
    { target: 10, duration: '0s' }
  ] ])
})

test('remainder', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">107</stringProp>
        <stringProp name="Start users count">23</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 23, duration: '0s' },
    { target: 46, duration: '0s' },
    { target: 69, duration: '0s' },
    { target: 92, duration: '0s' },
    { target: 107, duration: '0s' }
  ] ])
})

test('ramp', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '5s' },
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' }
  ] ])
})

test('burst', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="Start users count burst">4</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' }
  ] ])
})

test('start interval', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="Start users period">30</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '5s' },
    { target: 2, duration: '30s' },
    { target: 4, duration: '5s' },
    { target: 4, duration: '30s' },
    { target: 6, duration: '5s' },
    { target: 6, duration: '30s' },
    { target: 8, duration: '5s' },
    { target: 8, duration: '30s' },
    { target: 10, duration: '5s' }
  ] ])
})

test('presleep', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">10</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="Threads initial delay">60</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 0, duration: '60s' },
    { target: 2, duration: '5s' },
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' }
  ] ])
})

test('stop', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">12</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="Stop users count">3</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '5s' },
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' },
    { target: 12, duration: '5s' },
    { target: 9, duration: '0s' },
    { target: 6, duration: '0s' },
    { target: 3, duration: '0s' },
    { target: 0, duration: '0s' }
  ] ])
})

test('stop interval', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">12</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="Stop users count">3</stringProp>
        <stringProp name="Stop users period">15</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '5s' },
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' },
    { target: 12, duration: '5s' },
    { target: 9, duration: '0s' },
    { target: 9, duration: '15s' },
    { target: 6, duration: '0s' },
    { target: 6, duration: '15s' },
    { target: 3, duration: '0s' },
    { target: 3, duration: '15s' },
    { target: 0, duration: '0s' }
  ] ])
})

test('flight', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <kg.apc.jmeter.threads.SteppingThreadGroup>
        <stringProp name="num_threads">12</stringProp>
        <stringProp name="Start users count">2</stringProp>
        <stringProp name="rampUp">5</stringProp>
        <stringProp name="flighttime">120</stringProp>
        <stringProp name="Stop users count">3</stringProp>
        <stringProp name="Stop users period">15</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.stages, [ [
    { target: 2, duration: '5s' },
    { target: 4, duration: '5s' },
    { target: 6, duration: '5s' },
    { target: 8, duration: '5s' },
    { target: 10, duration: '5s' },
    { target: 12, duration: '5s' },
    { target: 12, duration: '120s' },
    { target: 9, duration: '0s' },
    { target: 9, duration: '15s' },
    { target: 6, duration: '0s' },
    { target: 6, duration: '15s' },
    { target: 3, duration: '0s' },
    { target: 3, duration: '15s' },
    { target: 0, duration: '0s' }
  ] ])
})
