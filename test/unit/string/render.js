/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import render from 'string/render';

test('empty', (t) => {
  const result = render('');
  t.is(result, '``');
});

test('static', (t) => {
  const result = render('cherry');
  t.is(result, '`cherry`');
});

test('1 expression', (t) => {
  const result = render('${FRUIT} pie');
  t.is(result, '`${vars[`FRUIT`]} pie`');
});

test('3 expressions', (t) => {
  const result = render('${BRAND} ${SIZE} ${FLAVOR} pie');
  t.is(result, '`${vars[`BRAND`]} ${vars[`SIZE`]} ${vars[`FLAVOR`]} pie`');
});

test('nested', (t) => {
  const result = render('${FRUIT${DESSERT}}');
  t.is(result, '`${vars[`FRUIT${vars[`DESSERT`]}`]}`');
});
