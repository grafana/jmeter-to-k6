import test from 'ava'
import interpolate from 'string/interpolate'

test('empty', t => {
  const result = interpolate('')
  t.is(result, '')
})

test('variable', t => {
  const context = { vars: new Map([ [ 'FRUIT', 'APPLE' ] ]) }
  /* eslint-disable-next-line no-template-curly-in-string */
  const result = interpolate('${FRUIT}', context)
  t.is(result, 'APPLE')
})

test('undefined variable', t => {
  t.throws(() => {
    /* eslint-disable-next-line no-template-curly-in-string */
    interpolate('${FRUIT}')
  })
})

test('function', t => {
  t.throws(() => {
    /* eslint-disable-next-line no-template-curly-in-string */
    interpolate('${__rand}')
  })
})
