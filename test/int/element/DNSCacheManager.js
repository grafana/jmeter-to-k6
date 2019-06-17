import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'

test('1 entry', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <DNSCacheManager>
        <collectionProp name="hosts">
          <elementProp>
            <stringProp name="Name">example.com</stringProp>
            <stringProp name="Address">1.1.1.1</stringProp>
          </elementProp>
        </collectionProp>
      </DNSCacheManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.hosts, {
    '"example.com"': '"1.1.1.1"'
  })
})

test('3 entries', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <hashTree>
      <DNSCacheManager>
        <collectionProp name="hosts">
          <elementProp>
            <stringProp name="Name">1.example.com</stringProp>
            <stringProp name="Address">1.1.1.1</stringProp>
          </elementProp>
          <elementProp>
            <stringProp name="Name">2.example.com</stringProp>
            <stringProp name="Address">2.2.2.2</stringProp>
          </elementProp>
          <elementProp>
            <stringProp name="Name">3.example.com</stringProp>
            <stringProp name="Address">3.3.3.3</stringProp>
          </elementProp>
        </collectionProp>
      </DNSCacheManager>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.deepEqual(result.options.hosts, {
    '"1.example.com"': '"1.1.1.1"',
    '"2.example.com"': '"2.2.2.2"',
    '"3.example.com"': '"3.3.3.3"'
  })
})
