import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Post } from 'symbol'
import ResultStatusActionHandler from 'element/ResultStatusActionHandler'

test('ignore', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultStatusActionHandler>
  <intProp name="action">0</intProp>
</ResultStatusActionHandler>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResultStatusActionHandler(node)
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) {}`
  ])
})

test('fail', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultStatusActionHandler>
  <intProp name="action">1</intProp>
</ResultStatusActionHandler>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResultStatusActionHandler(node)
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) k6.fail('Request failed: ' + r.status)`
  ])
})

test('continue', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultStatusActionHandler>
  <intProp name="action">5</intProp>
</ResultStatusActionHandler>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResultStatusActionHandler(node)
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) continue`
  ])
})

test('break', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultStatusActionHandler>
  <intProp name="action">6</intProp>
</ResultStatusActionHandler>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResultStatusActionHandler(node)
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) break`
  ])
})
