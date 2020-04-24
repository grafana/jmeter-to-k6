import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import { Post } from 'symbol';
import JSONPostProcessor from 'element/JSONPostProcessor';

test('named', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">1</stringProp>
  <stringProp name="referenceNames">output</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      matches = jsonpath.query(body, query)
      extract = (1 > matches.length ? null : matches[0])
      if (extract) vars[output] = extract
    }
  }
}`
  );
});

test('random', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">0</stringProp>
  <stringProp name="referenceNames">output</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      matches = jsonpath.query(body, query)
      extract = (matches.length === 0 ? null : matches[Math.floor(Math.random()*matches.length)])
      if (extract) vars[output] = extract
    }
  }
}`
  );
});

test('default', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">1</stringProp>
  <stringProp name="referenceNames">output</stringProp>
  <stringProp name="defaultValues">--NOTFOUND--</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const defaults = ["--NOTFOUND--"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      const defaultValue = defaults[i]
      matches = jsonpath.query(body, query)
      extract = (1 > matches.length ? null : matches[0])
      vars[output] = extract || defaultValue
    }
  } else defaults.forEach((value, i) => { vars[outputs[i]] = value })
}`
  );
});

test('multiple', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book;$.author;$.publisher</stringProp>
  <stringProp name="match_numbers">1</stringProp>
  <stringProp name="referenceNames">book;author;publisher</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book","$.author","$.publisher"]
  const outputs = ["book","author","publisher"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      matches = jsonpath.query(body, query)
      extract = (1 > matches.length ? null : matches[0])
      if (extract) vars[output] = extract
    }
  }
}`
  );
});

test('multiple default', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book;$.author;$.publisher</stringProp>
  <stringProp name="match_numbers">1</stringProp>
  <stringProp name="referenceNames">book;author;publisher</stringProp>
  <stringProp name="defaultValues">--NONE--;--NONE--;--NONE--</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book","$.author","$.publisher"]
  const outputs = ["book","author","publisher"]
  const defaults = ["--NONE--","--NONE--","--NONE--"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      const defaultValue = defaults[i]
      matches = jsonpath.query(body, query)
      extract = (1 > matches.length ? null : matches[0])
      vars[output] = extract || defaultValue
    }
  } else defaults.forEach((value, i) => { vars[outputs[i]] = value })
}`
  );
});

test('combine', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">1</stringProp>
  <stringProp name="referenceNames">output</stringProp>
  <boolProp name="compute_concat">true</boolProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      matches = jsonpath.query(body, query)
      extract = (1 > matches.length ? null : matches[0])
      if (extract) vars[output] = extract
      vars[output + '_ALL'] = matches.join(',')
    }
  }
}`
  );
});

test('distribute', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">-1</stringProp>
  <stringProp name="referenceNames">output</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      matches = jsonpath.query(body, query)
      for (let j = 0; j < matches.length; j++) {
        match = matches[j]
        vars[output + '_' + (j+1)] = match
      }
    }
  }
}`
  );
});

test('distribute default', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<JSONPostProcessor>
  <stringProp name="jsonPathExprs">$.book</stringProp>
  <stringProp name="match_numbers">-1</stringProp>
  <stringProp name="referenceNames">output</stringProp>
  <stringProp name="defaultValues">--NOTFOUND--</stringProp>
</JSONPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = JSONPostProcessor(node);
  const logic = result.defaults[0][Post][0];
  t.is(
    logic,
    `{
  const queries = ["$.book"]
  const outputs = ["output"]
  const defaults = ["--NOTFOUND--"]
  const body = (() => {
    try { return JSON.parse(r.body) }
    catch (e) { return null }
  })()
  if (body) {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const output = outputs[i]
      const defaultValue = defaults[i]
      matches = jsonpath.query(body, query)
      for (let j = 0; j < matches.length; j++) {
        match = matches[j]
        vars[output + '_' + (j+1)] = match
      }
      if (!matches.length) vars[output] = defaultValue
    }
  } else defaults.forEach((value, i) => { vars[outputs[i]] = value })
}`
  );
});
