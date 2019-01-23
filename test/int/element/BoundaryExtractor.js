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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
extract = (1 >= matches.length ? null : matches[0])
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
extract = (3 >= matches.length ? null : matches[2])
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
extract = (matches.length === 0 ? null : matches[Math.floor(Math.random()*matches.length)])
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
extract = (5 >= matches.length ? null : matches[4])
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
extract = (1 >= matches.length ? null : matches[0])
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
vars[${'`output`'} + '_matchNr'] = matches.length
for (let i = (matches.length - 1); i >= 0; i--) {
  vars[${'`output`'} + '_' + (i+1)] = matches[i]
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
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match[1])
  return matches
})()
vars[${'`output`'}] = "--NOMATCH--"
vars[${'`output`'} + '_matchNr'] = matches.length
for (let i = (matches.length - 1); i >= 0; i--) {
  vars[${'`output`'} + '_' + (i+1)] = matches[i]
}`)
})
