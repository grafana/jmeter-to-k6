import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import BeanShellPreProcessor from 'element/BeanShellPreProcessor'

test('code', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BeanShellPreProcessor>
  <stringProp name="script">a = 1
b = a * 5
print(b)</stringProp>
</BeanShellPreProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BeanShellPreProcessor(node)
  t.is(result.logic, `

/* BeanShellPreProcessor

a = 1
b = a * 5
print(b)

*/`)
})

test('file', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BeanShellPreProcessor>
  <stringProp name="filename">file.script</stringProp>
</BeanShellPreProcessor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BeanShellPreProcessor(node)
  t.is(result.logic, `

/* BeanShellPreProcessor

file: file.script

*/`)
})
