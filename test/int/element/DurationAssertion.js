import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Check } from 'symbol'
import DurationAssertion from 'element/DurationAssertion'

test('check', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DurationAssertion>
  <stringProp name="duration">2000</stringProp>
</DurationAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = DurationAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'DurationAssertion': 'return (r.timings.duration <= 2000)'
  })
})
