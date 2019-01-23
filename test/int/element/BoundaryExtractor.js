import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import BoundaryExtractor from 'element/BoundaryExtractor'

test('match 1', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
extract = (1 >= matches.length ? null : matches[1])
if (extract) vars[${'`output`'}] = extract`)
})

test('match 3', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">3</stringProp>
  <stringProp name="refname">output</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
extract = (3 >= matches.length ? null : matches[3])
if (extract) vars[${'`output`'}] = extract`)
})

test('random', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">0</stringProp>
  <stringProp name="refname">output</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
extract = (matches.length <= 1 ? null : matches[Math.floor(Math.random()*(matches.length-1))+1])
if (extract) vars[${'`output`'}] = extract`)
})

test('default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">5</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
extract = (5 >= matches.length ? null : matches[5])
vars[${'`output`'}] = extract || "--NOTFOUND--"`)
})

test('default clear', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
  <boolProp name="default_empty_value">true</boolProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
extract = (1 >= matches.length ? null : matches[1])
vars[${'`output`'}] = extract || ''`)
})

test('distribute', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="refname">output</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
vars[${'`output`'} + '_matchNr'] = matches.length - 1
for (let i = (matches.length - 1); i > 0; i--) {
  vars[${'`output`'} + '_' + i] = matches[i]
}`)
})

test('distribute default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BoundaryExtractor>
  <stringProp name="lboundary">START</stringProp>
  <stringProp name="rboundary">END</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOMATCH--</stringProp>
</BoundaryExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = BoundaryExtractor(node)
  t.is(result.logic, `

regex = new RegExp("START" + '(.*)' + "END", 'g')
matches = regex.exec(r.body)
vars[${'`output`'}] = "--NOMATCH--"
vars[${'`output`'} + '_matchNr'] = matches.length - 1
for (let i = (matches.length - 1); i > 0; i--) {
  vars[${'`output`'} + '_' + i] = matches[i]
}`)
})
