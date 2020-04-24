import test from 'ava';
import merge from 'merge';

test('empty', (t) => {
  const base = { options: {}, imports: new Map(), logic: '' };
  const update = { options: {}, imports: new Map(), logic: '' };
  merge(base, update);
  t.deepEqual(base, { options: {}, imports: new Map(), logic: '' });
});

test('add option', (t) => {
  const base = { options: {}, imports: new Map(), logic: '' };
  const update = { options: { linger: true }, imports: new Map(), logic: '' };
  merge(base, update);
  t.deepEqual(base, {
    options: { linger: true },
    imports: new Map(),
    logic: '',
  });
});

test('add import', (t) => {
  const base = { options: {}, imports: new Map(), logic: '' };
  const update = {
    options: {},
    imports: new Map([['k6', 'k6']]),
    logic: '',
  };
  merge(base, update);
  t.deepEqual(base, {
    options: {},
    imports: new Map([['k6', 'k6']]),
    logic: '',
  });
});

test('add var', (t) => {
  const base = { vars: new Map() };
  const update = { vars: new Map([['a', { value: '1' }]]) };
  merge(base, update);
  t.deepEqual(base, { vars: new Map([['a', { value: '1' }]]) });
});

test('add init', (t) => {
  const base = { init: '' };
  const update = { init: '// Test search page\n' };
  merge(base, update);
  t.deepEqual(base, { init: '// Test search page\n' });
});

test('add setup', (t) => {
  const base = { setup: '' };
  const update = { setup: 'let a = 5\n' };
  merge(base, update);
  t.deepEqual(base, { setup: 'let a = 5\n' });
});

test('add prolog', (t) => {
  const base = { prolog: '' };
  const update = { prolog: 'let a = 5\n' };
  merge(base, update);
  t.deepEqual(base, { prolog: 'let a = 5\n' });
});

test('add logic', (t) => {
  const base = {};
  const update = { logic: 'let a = 5\n' };
  merge(base, update);
  t.deepEqual(base, { logic: 'let a = 5\n' });
});

test('add user logic', (t) => {
  const base = { users: [] };
  const update = { logic: 'let a = 5\n', user: true };
  merge(base, update);
  t.deepEqual(base, { users: ['let a = 5\n'] });
});

test('add teardown', (t) => {
  const base = { teardown: '' };
  const update = { teardown: 'resource.close()\n' };
  merge(base, update);
  t.deepEqual(base, { teardown: 'resource.close()\n' });
});

test('merge option', (t) => {
  const base = { options: { linger: true }, imports: new Map(), logic: '' };
  const update = { options: { paused: true }, imports: new Map(), logic: '' };
  merge(base, update);
  t.deepEqual(base, {
    options: { linger: true, paused: true },
    imports: new Map(),
    logic: '',
  });
});

test('merge import', (t) => {
  const base = {
    options: {},
    imports: new Map([['first', 'first']]),
    logic: '',
  };
  const update = {
    options: {},
    imports: new Map([['second', 'second']]),
    logic: '',
  };
  merge(base, update);
  t.deepEqual(base, {
    options: {},
    imports: new Map([
      ['first', 'first'],
      ['second', 'second'],
    ]),
    logic: '',
  });
});

test('merge var', (t) => {
  const base = { vars: new Map([['a', { value: '1' }]]) };
  const update = { vars: new Map([['b', { value: '2' }]]) };
  merge(base, update);
  t.deepEqual(base, {
    vars: new Map([
      ['a', { value: '1' }],
      ['b', { value: '2' }],
    ]),
  });
});

test('merge init', (t) => {
  const base = { init: '// Test search page\n' };
  const update = { init: '// Runs 500 threads\n' };
  merge(base, update);
  t.deepEqual(base, { init: '// Test search page\n// Runs 500 threads\n' });
});

test('merge setup', (t) => {
  const base = { setup: 'let a = 5\n' };
  const update = { setup: 'let b = 6\n' };
  merge(base, update);
  t.deepEqual(base, { setup: 'let a = 5\nlet b = 6\n' });
});

test('merge prolog', (t) => {
  const base = { prolog: 'let a = 5\n' };
  const update = { prolog: 'let b = 6\n' };
  merge(base, update);
  t.deepEqual(base, { prolog: 'let a = 5\nlet b = 6\n' });
});

test('merge logic', (t) => {
  const base = { logic: 'let a = 5\n' };
  const update = { logic: 'let b = 6\n' };
  merge(base, update);
  t.deepEqual(base, { logic: 'let a = 5\nlet b = 6\n' });
});

test('merge teardown', (t) => {
  const base = { teardown: 'resource1.close()\n' };
  const update = { teardown: 'resource2.close()\n' };
  merge(base, update);
  t.deepEqual(base, { teardown: 'resource1.close()\nresource2.close()\n' });
});
