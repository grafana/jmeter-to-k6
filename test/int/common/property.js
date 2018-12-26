import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import property from 'common/property'

test('string empty', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<stringProp name="description"/>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = property(node)
  t.deepEqual(result, { description: null })
})

test('string nonempty', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<stringProp name="description">The most hargled of all</stringProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = property(node)
  t.deepEqual(result, { description: 'The most hargled of all' })
})

test('bool empty', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag"/>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = property(node)
  t.deepEqual(result, { flag: null })
})

test('bool true', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag">true</boolProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = property(node)
  t.deepEqual(result, { flag: true })
})

test('bool false', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag">false</boolProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = property(node)
  t.deepEqual(result, { flag: false })
})
