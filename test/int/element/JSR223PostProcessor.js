import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import JSR223PostProcessor from 'element/JSR223PostProcessor'

test('code', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSR223PostProcessor>
  <stringProp name="script">a = 1
b = a * 5
print(b)</stringProp>
  <stringProp name="scriptLanguage">groovy</stringProp>
</JSR223PostProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSR223PostProcessor(node)
  t.is(result.logic, `

/* JSR223PostProcessor

language: groovy

a = 1
b = a * 5
print(b)

*/`)
})

test('file', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSR223PostProcessor>
  <stringProp name="filename">file.script</stringProp>
  <stringProp name="scriptLanguage">groovy</stringProp>
</JSR223PostProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSR223PostProcessor(node)
  t.is(result.logic, `

/* JSR223PostProcessor

language: groovy

file: file.script

*/`)
})
