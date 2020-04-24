import test from 'ava';
import makeContext from 'context';
import parseXml from '@rgrove/parse-xml';
import BeanShellPostProcessor from 'element/BeanShellPostProcessor';

test('code', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BeanShellPostProcessor>
  <stringProp name="script">a = 1
b = a * 5
print(b)</stringProp>
</BeanShellPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const context = makeContext();
  const result = BeanShellPostProcessor(node, context);
  t.is(
    result.logic,
    `

/* BeanShellPostProcessor

a = 1
b = a * 5
print(b)

*/`
  );
});

test('file', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<BeanShellPostProcessor>
  <stringProp name="filename">file.script</stringProp>
</BeanShellPostProcessor>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const context = makeContext();
  const result = BeanShellPostProcessor(node, context);
  t.is(
    result.logic,
    `

/* BeanShellPostProcessor

file: "file.script"

*/`
  );
});
