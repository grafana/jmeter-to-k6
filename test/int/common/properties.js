import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import properties from 'common/properties'

test('properties', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Adversary>
  <stringProp name="description">The most hargled of all</stringProp>
  <boolProp name="alive">true</boolProp>
  <boolProp name="comingForYou">true</boolProp>
  <boolProp name="stoppable">false</boolProp>
</Adversary>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = properties(node)
  t.deepEqual(result, {
    description: '"The most hargled of all"',
    alive: true,
    comingForYou: true,
    stoppable: false
  })
})
