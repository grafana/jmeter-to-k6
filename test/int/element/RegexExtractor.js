import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import RegexExtractor from 'element/RegexExtractor'

test.skip('match 1', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

matches = perlRegex.exec(r.body, "(.+): (.+)", 'g')
extract = (1 >= matches.length ? null : matches[1])
if (extract) vars[${'`output`'}] = extract`)
})

test.skip('match 2', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">2</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

matches = perlRegex.exec(r.body, "(.+): (.+)", 'g')
extract = (2 >= matches.length ? null : matches[2])
if (extract) vars[${'`output`'}] = extract`)
})

test.skip('random', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">.+: (.+)</stringProp>
  <stringProp name="match_number">0</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

matches = perlRegex.exec(r.body, ".+: (.+)", 'g')
extract = (matches.length <= 1 ? null : matches[Math.floor(Math.random()*(matches.length-1))+1])
if (extract) vars[${'`output`'}] = extract`)
})

test.skip('default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

matches = perlRegex.exec(r.body, "(.+): (.+)", 'g')
extract = (1 >= matches.length ? null : matches[1])
vars[${'`output`'}] = extract || "--NOTFOUND--"`)
})

test.skip('default clear', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
  <boolProp name="default_empty_value">true</boolProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

matches = perlRegex.exec(r.body, "(.+): (.+)", 'g')
extract = (1 >= matches.length ? null : matches[1])
vars[${'`output`'}] = extract || ''`)
})
