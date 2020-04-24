import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import RandomController from 'element/RandomController';

test('convert', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<RandomController>
  <Fake/>
  <Fake/>
  <Fake/>
</RandomController>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = RandomController(node);
  t.is(
    result.logic,
    `

{ const index = Math.floor(Math.random()*(3)); switch (index) {
  case 0:
    // Fake
    break
  case 1:
    // Fake
    break
  case 2:
    // Fake
    break
  default: throw new Error('Unexpected random index: ' + index)
} }`
  );
});
