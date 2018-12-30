import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('1 header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <HeaderManager>
        <collectionProp name="headers">
          <elementProp>
            <stringProp name="name">User-Agent</stringProp>
            <stringProp name="value">k6-load-tester</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  const headers = result.constants.get('headers')
  t.deepEqual(headers, new Map([
    [ 'User-Agent', 'k6-load-tester' ]
  ]))
})

test('3 headers', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <HeaderManager>
        <collectionProp name="headers">
          <elementProp>
            <stringProp name="name">User-Agent</stringProp>
            <stringProp name="value">k6-load-tester</stringProp>
          </elementProp>
          <elementProp>
            <stringProp name="name">Accept-Charset</stringProp>
            <stringProp name="value">utf-8</stringProp>
          </elementProp>
          <elementProp>
            <stringProp name="name">Accept-Encoding</stringProp>
            <stringProp name="value">gzip, deflate</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  const headers = result.constants.get('headers')
  t.deepEqual(headers, new Map([
    [ 'User-Agent', 'k6-load-tester' ],
    [ 'Accept-Charset', 'utf-8' ],
    [ 'Accept-Encoding', 'gzip, deflate' ]
  ]))
})
