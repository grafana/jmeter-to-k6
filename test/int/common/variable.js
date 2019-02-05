import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import variable from 'common/variable'

test('variable', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<elementProp name="a" elementType="Argument">
  <stringProp name="Argument.name">a</stringProp>
  <stringProp name="Argument.value">5</stringProp>
</elementProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = variable(node)
  t.deepEqual(
    result.vars,
    new Map([ [ 'a', { value: '5' } ] ])
  )
})

test('comment', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<elementProp name="a" elementType="Argument">
  <stringProp name="Argument.name">a</stringProp>
  <stringProp name="Argument.value">5</stringProp>
  <stringProp name="Argument.desc">Number of apples</stringProp>
</elementProp>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = variable(node)
  t.deepEqual(
    result.vars,
    new Map([ [ 'a', { value: '5', comment: 'Number of apples' } ] ])
  )
})
