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

test('add logic', t => {
  const base = { options: {}, imports: new Set(), logic: '' }
  const update = { options: {}, imports: new Set(), logic: 'const a = 5\n' }
  merge(base, update)
  t.deepEqual(
    base,
    { options: {}, imports: new Set(), logic: 'const a = 5\n' }
  )
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

test('merge logic', t => {
  const base = { options: {}, imports: new Set(), logic: 'const a = 5\n' }
  const update = { options: {}, imports: new Set(), logic: 'const b = 6\n' }
  merge(base, update)
  t.deepEqual(
    base,
    {
      options: {},
      imports: new Set(),
      logic: 'const a = 5\nconst b = 6\n'
    }
  )
})
