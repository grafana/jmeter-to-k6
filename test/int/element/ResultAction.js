import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import { Post } from 'symbol';
import ResultAction from 'element/ResultAction';

test('ignore', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultAction>
  <intProp name="action">0</intProp>
</ResultAction>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = ResultAction(node);
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) {}`,
  ]);
});

test('fail', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultAction>
  <intProp name="action">1</intProp>
</ResultAction>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = ResultAction(node);
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) fail('Request failed: ' + r.status)`,
  ]);
});

test('continue', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultAction>
  <intProp name="action">5</intProp>
</ResultAction>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = ResultAction(node);
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) continue`,
  ]);
});

test('break', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ResultAction>
  <intProp name="action">6</intProp>
</ResultAction>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = ResultAction(node);
  t.deepEqual(result.defaults[0][Post], [
    `if (Math.floor(r.status/100) !== 2) break`,
  ]);
});
