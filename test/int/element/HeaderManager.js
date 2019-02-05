import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Header } from 'symbol'
import HeaderManager from 'element/HeaderManager'

test('1 header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HeaderManager>
  <collectionProp name="headers">
    <elementProp>
      <stringProp name="name">User-Agent</stringProp>
      <stringProp name="value">k6-load-tester</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HeaderManager(node)
  t.deepEqual(result.defaults, [ { [Header]: new Map([
    [ 'User-Agent', 'k6-load-tester' ]
  ]) } ])
})

test('3 headers', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HeaderManager(node)
  t.deepEqual(result.defaults, [ { [Header]: new Map([
    [ 'User-Agent', 'k6-load-tester' ],
    [ 'Accept-Charset', 'utf-8' ],
    [ 'Accept-Encoding', 'gzip, deflate' ]
  ]) } ])
})
