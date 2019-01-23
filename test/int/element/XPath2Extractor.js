import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import XPath2Extractor from 'element/XPath2Extractor'

test('comment', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<XPath2Extractor/>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = XPath2Extractor(node)
  t.is(result.logic, `

// There's currently no XPath API in k6 so a pure JS solution has to be used.
// Try https://github.com/google/wicked-good-xpath.`)
})
