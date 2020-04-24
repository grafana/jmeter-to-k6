import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import IfController from 'element/IfController';

test('collective', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<IfController>
  <stringProp name="condition">1 === 1</stringProp>
</IfController>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = IfController(node);
  t.is(
    result.logic,
    `

if (eval("1 === 1")) {

}`
  );
});

test('expression', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<IfController>
  <stringProp name="condition">\${AUTH}</stringProp>
  <boolProp name="useExpression">true</boolProp>
</IfController>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = IfController(node);
  t.is(
    result.logic,
    `

if (\`\${vars[\`AUTH\`]}\`.toLowerCase() === 'true') {

}`
  );
});

test('individual', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<IfController>
  <stringProp name="condition">1 === 1</stringProp>
  <boolProp name="evaluateAll">true</boolProp>
  <Fake/>
  <Fake/>
  <Fake/>
</IfController>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = IfController(node);
  t.is(
    result.logic,
    `

if (eval("1 === 1")) {
  // Fake
}

if (eval("1 === 1")) {
  // Fake
}

if (eval("1 === 1")) {
  // Fake
}`
  );
});
