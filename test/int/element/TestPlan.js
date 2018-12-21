import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import empty from 'helper/empty'
import document from 'document'

test('empty', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan/>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result, empty)
})

test('name', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan testname="White Zinc Fox"/>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.prolog, '// White Zinc Fox\n')
})

test('comments', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <stringProp name="TestPlan.comments">first line
second line

fourth line</stringProp>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.prolog, `
/*
first line
second line

fourth line
*/
`)
})

test('variables', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <elementProp name="TestPlan.user_defined_variables">
        <collectionProp>
          <elementProp>
            <stringProp name="Argument.name">a</stringProp>
            <stringProp name="Argument.value">1</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(
    result.vars,
    new Map([ [ 'a', { value: '1' } ] ])
  )
})
