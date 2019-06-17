import test from 'ava'
import makeContext from 'context'
import parseXml from '@rgrove/parse-xml'
import { Post } from 'symbol'
import JSONPathExtractor from 'element/JSONPathExtractor'

test('json', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
  <stringProp name="SUBJECT">BODY</stringProp>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSONPATH">$.book</stringProp>
  <stringProp name="VAR">output</stringProp>
</com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  const serial = r.body
  const input = (() => {
    try { return JSON.parse(serial) }
    catch (e) { return null }
  })()
  matches = jsonpath.query(input, "$.book")
  output = "output"
  if (matches.length) {
    vars[output] = (matches[0] === null ? 'null' : matches[0])
  }
  for (let i = 0; i < matches.length; i++) {
    vars[output + '_' + (i+1)] = matches[i]
  }
}`)
})

test('yaml', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
  <stringProp name="SUBJECT">BODY</stringProp>
  <stringProp name="INPUT_FORMAT">YAML</stringProp>
  <stringProp name="JSONPATH">$.book</stringProp>
  <stringProp name="VAR">output</stringProp>
</com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  const serial = r.body
  const input = (() => {
    try { return yaml.parse(serial) }
    catch (e) { return null }
  })()
  matches = jsonpath.query(input, "$.book")
  output = "output"
  if (matches.length) {
    vars[output] = (matches[0] === null ? 'null' : matches[0])
  }
  for (let i = 0; i < matches.length; i++) {
    vars[output + '_' + (i+1)] = matches[i]
  }
}`)
})

test('input var', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
  <stringProp name="SUBJECT">VAR</stringProp>
  <stringProp name="VARIABLE">input</stringProp>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSONPATH">$.book</stringProp>
  <stringProp name="VAR">output</stringProp>
</com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  const serial = vars["input"] || ''
  const input = (() => {
    try { return JSON.parse(serial) }
    catch (e) { return null }
  })()
  matches = jsonpath.query(input, "$.book")
  output = "output"
  if (matches.length) {
    vars[output] = (matches[0] === null ? 'null' : matches[0])
  }
  for (let i = 0; i < matches.length; i++) {
    vars[output + '_' + (i+1)] = matches[i]
  }
}`)
})

test('default', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
  <stringProp name="SUBJECT">BODY</stringProp>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSONPATH">$.book</stringProp>
  <stringProp name="VAR">output</stringProp>
  <stringProp name="DEFAULT">--NOTFOUND--</stringProp>
</com.atlantbh.jmeter.plugins.jsonutils.jsonpathextractor.JSONPathExtractor>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathExtractor(node, makeContext())
  const logic = result.defaults[0][Post][0]
  t.is(logic, `{
  const serial = r.body
  const input = (() => {
    try { return JSON.parse(serial) }
    catch (e) { return null }
  })()
  matches = jsonpath.query(input, "$.book")
  output = "output"
  if (matches.length) {
    vars[output] = (matches[0] === null ? 'null' : matches[0])
  } else vars[output] = "--NOTFOUND--"
  for (let i = 0; i < matches.length; i++) {
    vars[output + '_' + (i+1)] = matches[i]
  }
}`)
})
