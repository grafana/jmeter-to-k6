import test from 'ava'
import merge from 'merge'

test('empty', t => {
  const base = { options: {}, imports: new Set(), logic: '' }
  const update = { options: {}, imports: new Set(), logic: '' }
  merge(base, update)
  t.deepEqual(base, { options: {}, imports: new Set(), logic: '' })
})

test('add option', t => {
  const base = { options: {}, imports: new Set(), logic: '' }
  const update = { options: { option1: true }, imports: new Set(), logic: '' }
  merge(base, update)
  t.deepEqual(
    base,
    { options: { option1: true }, imports: new Set(), logic: '' }
  )
})

test('add import', t => {
  const base = { options: {}, imports: new Set(), logic: '' }
  const update = { options: {}, imports: new Set([ 'k6' ]), logic: '' }
  merge(base, update)
  t.deepEqual(
    base,
    { options: {}, imports: new Set([ 'k6' ]), logic: '' }
  )
})

test('add var', t => {
  const base = { vars: new Map() }
  const update = { vars: new Map([ [ 'a', { value: '1' } ] ]) }
  merge(base, update)
  t.deepEqual(base, { vars: new Map([ [ 'a', { value: '1' } ] ]) })
})

test('add setup', t => {
  const base = { setup: '' }
  const update = { setup: 'let a = 5\n' }
  merge(base, update)
  t.deepEqual(base, { setup: 'let a = 5\n' })
})

test('add prolog', t => {
  const base = { prolog: '' }
  const update = { prolog: 'let a = 5\n' }
  merge(base, update)
  t.deepEqual(base, { prolog: 'let a = 5\n' })
})

test('add logic', t => {
  const base = {}
  const update = { logic: 'let a = 5\n' }
  merge(base, update)
  t.deepEqual(base, { logic: 'let a = 5\n' })
})

test('add user logic', t => {
  const base = { users: [] }
  const update = { logic: 'let a = 5\n', user: true }
  merge(base, update)
  t.deepEqual(base, { users: [ 'let a = 5\n' ] })
})

test('merge option', t => {
  const base = { options: { option1: true }, imports: new Set(), logic: '' }
  const update = { options: { option2: true }, imports: new Set(), logic: '' }
  merge(base, update)
  t.deepEqual(
    base,
    {
      options: { option1: true, option2: true },
      imports: new Set(),
      logic: ''
    }
  )
})

test('merge import', t => {
  const base = { options: {}, imports: new Set([ 'first' ]), logic: '' }
  const update = { options: {}, imports: new Set([ 'second' ]), logic: '' }
  merge(base, update)
  t.deepEqual(
    base,
    {
      options: {},
      imports: new Set([ 'first', 'second' ]),
      logic: ''
    }
  )
})

test('merge var', t => {
  const base = { vars: new Map([ [ 'a', { value: '1' } ] ]) }
  const update = { vars: new Map([ [ 'b', { value: '2' } ] ]) }
  merge(base, update)
  t.deepEqual(base, { vars: new Map([
    [ 'a', { value: '1' } ],
    [ 'b', { value: '2' } ]
  ]) })
})

test('merge setup', t => {
  const base = { setup: 'let a = 5\n' }
  const update = { setup: 'let b = 6\n' }
  merge(base, update)
  t.deepEqual(base, { setup: 'let a = 5\nlet b = 6\n' })
})

test('merge prolog', t => {
  const base = { prolog: 'let a = 5\n' }
  const update = { prolog: 'let b = 6\n' }
  merge(base, update)
  t.deepEqual(base, { prolog: 'let a = 5\nlet b = 6\n' })
})

test('merge logic', t => {
  const base = { logic: 'let a = 5\n' }
  const update = { logic: 'let b = 6\n' }
  merge(base, update)
  t.deepEqual(base, { logic: 'let a = 5\nlet b = 6\n' })
})
