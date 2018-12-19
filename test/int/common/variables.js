import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import variables from 'common/variables'

test('3 variables', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<collectionProp>
  <elementProp>
    <stringProp name="Argument.name">a</stringProp>
    <stringProp name="Argument.value">1</stringProp>
  </elementProp>
  <elementProp>
    <stringProp name="Argument.name">b</stringProp>
    <stringProp name="Argument.value">2</stringProp>
  </elementProp>
  <elementProp>
    <stringProp name="Argument.name">c</stringProp>
    <stringProp name="Argument.value">3</stringProp>
  </elementProp>
</collectionProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = variables(node)
  t.deepEqual(
    result.vars,
    new Map([
      [ 'a', { value: '1' } ],
      [ 'b', { value: '2' } ],
      [ 'c', { value: '3' } ]
    ])
  )
})
