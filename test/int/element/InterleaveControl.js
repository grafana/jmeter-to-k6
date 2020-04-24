import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import InterleaveControl from 'element/InterleaveControl';

test('3 items', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<InterleaveControl>
  <Fake/>
  <Fake/>
  <Fake/>
</InterleaveControl>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = InterleaveControl(node);
  t.is(
    result.logic,
    `

{ const index = (__ITER - ((__ITER/3|0)*3)); switch (index) {
  case 0:
    // Fake
    break
  case 1:
    // Fake
    break
  case 2:
    // Fake
    break
  default: throw new Error('Unexpected interleave index: ' + index)
} }`
  );
});

test('6 items', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<InterleaveControl>
  <Fake/>
  <Fake/>
  <Fake/>
  <Fake/>
  <Fake/>
  <Fake/>
</InterleaveControl>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = InterleaveControl(node);
  t.is(
    result.logic,
    `

{ const index = (__ITER - ((__ITER/6|0)*6)); switch (index) {
  case 0:
    // Fake
    break
  case 1:
    // Fake
    break
  case 2:
    // Fake
    break
  case 3:
    // Fake
    break
  case 4:
    // Fake
    break
  case 5:
    // Fake
    break
  default: throw new Error('Unexpected interleave index: ' + index)
} }`
  );
});
