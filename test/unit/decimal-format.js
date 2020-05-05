import test from 'ava';
import format from '../../src/decimal-format';

test('should return 5 given 0 and 5', (t) => {
  t.is(format('0', 5), '5');
});
test('should return 05 given 00 and 5', (t) => {
  t.is(format('00', 5), '05');
});
test('should return S050 given S000 and 50', (t) => {
  t.is(format('S000', 50), 'S050');
});
test('should return 100.00 given 000.00 and 100', (t) => {
  t.is(format('000.00', 100, false), '100.00');
});
test('should return $10.02 given $00.00 and 10.02', (t) => {
  t.is(format('$00.00', 10.02, true), '$10.02');
});
test('should return $10.02 given $00.00 and 10.029', (t) => {
  t.is(format('$00.00', 10.029, true), '$10.02');
});
test('should return $0.02 given $00.00 and .02', (t) => {
  t.is(format('$00.00', 0.02, true), '$00.02');
});
test('should return 100-00-12A given 100-00-00A and 12', (t) => {
  t.is(format('100-00-00A', 12, true), '100-00-12A');
});
