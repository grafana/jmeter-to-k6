import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('1 cookie', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <CookieManager>
        <collectionProp name="cookies">
          <elementProp name="theme">
            <stringProp name="value">light</stringProp>
          </elementProp>
        </collectionProp>
      </CookieManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.imports.get('http'), 'k6/http')
  t.deepEqual(result.cookies, new Map([
    [ 'theme', { value: 'light' } ]
  ]))
})

test('3 cookies', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <CookieManager>
        <collectionProp name="cookies">
          <elementProp name="theme">
            <stringProp name="value">light</stringProp>
          </elementProp>
          <elementProp name="username">
            <stringProp name="value">User759</stringProp>
          </elementProp>
          <elementProp name="session">
            <stringProp name="value">908234908</stringProp>
          </elementProp>
        </collectionProp>
      </CookieManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.cookies, new Map([
    [ 'theme', { value: 'light' } ],
    [ 'username', { value: 'User759' } ],
    [ 'session', { value: '908234908' } ]
  ]))
})
