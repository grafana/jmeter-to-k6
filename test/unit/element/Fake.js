import test from 'ava';
import Fake from 'element/Fake';

test('logic', (t) => {
  const node = {};
  const result = Fake(node);
  t.is(result.logic, '\n// Fake');
});
