import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import { Delay } from 'symbol';
import ConstantTimer from 'element/ConstantTimer';

test('delay', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConstantDelay>
  <stringProp name="delay">300</stringProp>
</ConstantDelay>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = ConstantTimer(node);
  t.deepEqual(result.defaults, [{ [Delay]: [{ delay: 300 }] }]);
});
