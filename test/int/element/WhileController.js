import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import WhileController from 'element/WhileController';

test('convert', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<WhileController>
  <stringProp name="condition">\${MORE}</stringProp>
  <Fake/>
</WhileController>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = WhileController(node);
  t.is(
    result.logic,
    `

{ let first = true; while (\`\${vars[\`MORE\`]}\` !== "false") {
  // Fake
  first = false
} }`
  );
});
