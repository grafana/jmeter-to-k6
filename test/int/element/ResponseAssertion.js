import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Check } from 'symbol'
import ResponseAssertion from 'element/ResponseAssertion'

test('match field', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">1</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion':
      'return (perlRegex.match(r.body, "Herbert\'s Bakery", "s"))'
  })
})

test('contain field', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">2</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion':
      'return (perlRegex.match(r.body, "Herbert\'s Bakery", "m"))'
  })
})

test('match header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_headers</stringProp>
  <intProp name="test_type">1</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (Object.values(r.headers).find(value =>' +
      ' perlRegex.match(value, "Herbert\'s Bakery", "s")))'
    )
  })
})

test('contain header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_headers</stringProp>
  <intProp name="test_type">2</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (Object.values(r.headers).find(value =>' +
      ' perlRegex.match(value, "Herbert\'s Bakery", "m")))'
    )
  })
})

test('equal field', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">8</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': 'return (r.body === "Herbert\'s Bakery")'
  })
})

test('equal status', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_code</stringProp>
  <intProp name="test_type">8</intProp>
  <collectionProp name="test_strings">
    <stringProp>200</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': 'return (r.status === 200)'
  })
})

test('equal header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_headers</stringProp>
  <intProp name="test_type">8</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (Object.values(r.headers).includes("Herbert\'s Bakery"))'
    )
  })
})

test('substring field', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">16</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': 'return (r.body.includes("Herbert\'s Bakery"))'
  })
})

test('substring header', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_headers</stringProp>
  <intProp name="test_type">16</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (Object.values(r.headers).find(value =>' +
      ' value.includes("Herbert\'s Bakery")))'
    )
  })
})

test('negate', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">12</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': 'return !(r.body === "Herbert\'s Bakery")'
  })
})

test('conjunction', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">16</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
    <stringProp>The best pastries!</stringProp>
    <stringProp>Buy something delicious today.</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (r.body.includes("Herbert\'s Bakery")' +
      ' && r.body.includes("The best pastries!")' +
      ' && r.body.includes("Buy something delicious today."))'
    )
  })
})

test('disjunction', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResponseAssertion>
  <stringProp name="test_field">response_data</stringProp>
  <intProp name="test_type">48</intProp>
  <collectionProp name="test_strings">
    <stringProp>Herbert's Bakery</stringProp>
    <stringProp>The best pastries!</stringProp>
    <stringProp>Buy something delicious today.</stringProp>
  </collectionProp>
</ResponseAssertion>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ResponseAssertion(node)
  t.deepEqual(result.defaults[0][Check], {
    'ResponseAssertion': (
      'return (r.body.includes("Herbert\'s Bakery")' +
      ' || r.body.includes("The best pastries!")' +
      ' || r.body.includes("Buy something delicious today."))'
    )
  })
})
