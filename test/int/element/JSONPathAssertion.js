import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Check } from 'symbol'
import JSONPathAssertion from 'element/JSONPathAssertion'

const value = `(typeof value === "object" ? JSON.stringify(value) : value)`

test('json extant', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!values.length`
  })
})

test('yaml extant', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">YAML</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return yaml.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!values.length`
  })
})

test('nonextant', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <stringProp name="EXPECTED_VALUE">[]</stringProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !values.length`
  })
})

test('null', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <boolProp name="EXPECT_NULL">true</boolProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!(values.find(value => value === null))`
  })
})

test('string', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <stringProp name="EXPECTED_VALUE">red</stringProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!(values.find(value => ${value} === "red"))`
  })
})

test('regex', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <stringProp name="EXPECTED_VALUE">red</stringProp>
  <boolProp name="ISREGEX">true</boolProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!(values.find(value => perlRegex.match(${value}, "red")))`
  })
})

test('not string', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <stringProp name="EXPECTED_VALUE">red</stringProp>
  <boolProp name="INVERT">true</boolProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!(!values.find(value => ${value} === "red"))`
  })
})

test('not regex', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPathAssertion>
  <stringProp name="INPUT_FORMAT">JSON</stringProp>
  <stringProp name="JSON_PATH">$.apple</stringProp>
  <stringProp name="EXPECTED_VALUE">red</stringProp>
  <boolProp name="ISREGEX">true</boolProp>
  <boolProp name="INVERT">true</boolProp>
</JSONPathAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = JSONPathAssertion(node)
  t.deepEqual(result.defaults[Check], {
    'JSONPathAssertion': `const body = (() => {
  try { return JSON.parse(r.body) }
  catch (e) { return null }
})()
if (!body) return false
const values = jsonpath.query(body, "$.apple")
return !!(!values.find(value => perlRegex.match(${value}, "red")))`
  })
})
