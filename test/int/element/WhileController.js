import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import WhileController from 'element/WhileController'

test('convert', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<WhileController>
  <stringProp name="condition">\${MORE}</stringProp>
</WhileController>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = WhileController(node)
  t.is(result.logic, `

while (eval('\`\${vars["MORE"]}\`') !== "false") {

}`)
})
