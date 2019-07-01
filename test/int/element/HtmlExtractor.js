import test from 'ava'
import makeContext from 'context'
import parseXml from '@rgrove/parse-xml'
import { Post } from 'symbol'
import HtmlExtractor from 'element/HtmlExtractor'

test('named', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  match = (1 > matches.size() ? null : matches.eq(0))
  extract = (match ? match.text() : null)
  if (extract) vars[output] = extract
}`)
})

test('random', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">0</stringProp>
  <stringProp name="refname">output</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  match = (matches.size() === 0 ? null : matches.eq(Math.floor(Math.random()*matches.size())))
  extract = (match ? match.text() : null)
  if (extract) vars[output] = extract
}`)
})

test('attribute', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="attribute">name</stringProp>
  <stringProp name="refname">output</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  match = (1 > matches.size() ? null : matches.eq(0))
  extract = (match ? match.attr("name") : null)
  if (extract) vars[output] = extract
}`)
})

test('default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  match = (1 > matches.size() ? null : matches.eq(0))
  extract = (match ? match.text() : null)
  vars[output] = extract || "--NOTFOUND--"
}`)
})

test('default clear', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">1</stringProp>
  <stringProp name="refname">output</stringProp>
  <boolProp name="default_empty_value">true</boolProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  match = (1 > matches.size() ? null : matches.eq(0))
  extract = (match ? match.text() : null)
  vars[output] = extract || ''
}`)
})

test('distribute text', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="refname">output</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  vars[output + '_matchNr'] = matches.size()
  for (let i = matches.size(); i >= 0; i--) {
    match = matches.eq(i)
    vars[output + '_' + (i+1)] = match.text()
  }
}`)
})

test('distribute attribute', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="attribute">name</stringProp>
  <stringProp name="refname">output</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  vars[output + '_matchNr'] = matches.size()
  for (let i = matches.size(); i >= 0; i--) {
    match = matches.eq(i)
    vars[output + '_' + (i+1)] = match.attr("name")
  }
}`)
})

test('distribute default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HtmlExtractor>
  <stringProp name="expr">div span</stringProp>
  <stringProp name="match_number">-1</stringProp>
  <stringProp name="refname">output</stringProp>
  <stringProp name="default">--NOTFOUND--</stringProp>
</HtmlExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HtmlExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  output = "output"
  const doc = html.parseHTML(r.body)
  matches = doc.find("div span")
  vars[output] = "--NOTFOUND--"
  vars[output + '_matchNr'] = matches.size()
  for (let i = matches.size(); i >= 0; i--) {
    match = matches.eq(i)
    vars[output + '_' + (i+1)] = match.text()
  }
}`)
})
