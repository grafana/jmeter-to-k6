import test from 'ava'
import makeContext from 'context'
import parseXml from '@rgrove/parse-xml'
import JSR223PreProcessor from 'element/JSR223PreProcessor'

test('code', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSR223PreProcessor>
  <stringProp name="script">a = 1
b = a * 5
print(b)</stringProp>
  <stringProp name="scriptLanguage">groovy</stringProp>
</JSR223PreProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSR223PreProcessor(node, makeContext())
  t.is(result.logic, `

/* JSR223PreProcessor

language: groovy

a = 1
b = a * 5
print(b)

*/`)
})

test('file', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSR223PreProcessor>
  <stringProp name="filename">file.script</stringProp>
  <stringProp name="scriptLanguage">groovy</stringProp>
</JSR223PreProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSR223PreProcessor(node, makeContext())
  t.is(result.logic, `

/* JSR223PreProcessor

language: groovy

file: "file.script"

*/`)
})
