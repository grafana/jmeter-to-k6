import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import RegexExtractor from 'element/RegexExtractor'

test('match 1', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
match = (1 >= matches.length ? null : matches[1])
output = ${'`output`'}
if (match) {
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`)
})

test('match 2', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">2</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
match = (2 >= matches.length ? null : matches[2])
output = ${'`output`'}
if (match) {
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`)
})

test('random', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">.+: (.+)</stringProp>
  <stringProp name="match_number">0</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp(".+: (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
match = (matches.length <= 1 ? null : matches[Math.floor(Math.random()*(matches.length-1))+1])
output = ${'`output`'}
if (match) {
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`)
})

test('default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
match = (1 >= matches.length ? null : matches[1])
output = ${'`output`'}
if (match) {
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {
  vars[output] = "--NOTFOUND--"
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`)
})

test('default clear', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
  <boolProp name="default_empty_value">true</boolProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
match = (1 >= matches.length ? null : matches[1])
output = ${'`output`'}
if (match) {
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output] = extract
  vars[output + '_g'] = match.length - 1
  for (let i = 0; i < match.length; i++) vars[output + '_g' + i] = match[i]
} else {
  vars[output] = ''
  delete vars[output + '_g']
  delete vars[output + '_g0']
  delete vars[output + '_g1']
}`)
})

test('distribute', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
output = ${'`output`'}
vars[output + '_matchNr'] = matches.length
for (let i = 0; i < matches.length; i++) {
  match = matches[i]
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output + '_' + i] = extract
  for (let j = 0; j < match.length; j++) {
    const name = output + '_' + i + '_g' + j
    vars[name] = match[j]
  }
}`)
})

test('distribute default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RegexExtractor>
  <stringProp name="regex">(.+): (.+)</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="template">$0$</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</RegexExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = RegexExtractor(node)
  t.is(result.logic, `

regex = new RegExp("(.+): (.+)")
matches = (() => {
  const matches = []
  while (match = regex.exec(r.body)) matches.push(match)
  return matches
})()
output = ${'`output`'}
vars[output] = "--NOTFOUND--"
vars[output + '_matchNr'] = matches.length
for (let i = 0; i < matches.length; i++) {
  match = matches[i]
  extract = "$0$".replace(${'/\\$(\\d*)\\$/g'}, (match, digits) => {
    if (!digits) return ''
    const index = Number.parseInt(digits, 10)
    if (index > (match.length - 1)) return ''
    return match[index]
  })
  vars[output + '_' + i] = extract
  for (let j = 0; j < match.length; j++) {
    const name = output + '_' + i + '_g' + j
    vars[name] = match[j]
  }
}`)
})
