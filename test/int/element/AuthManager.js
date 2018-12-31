import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import { Authentication } from 'symbol'
import AuthManager from 'element/AuthManager'

test('1 entry', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<AuthManager>
  <collectionProp name="auth_list">
    <elementProp>
      <stringProp name="url">example.com</stringProp>
      <stringProp name="username">User123</stringProp>
      <stringProp name="password">secret1</stringProp>
    </elementProp>
  </collectionProp>
</AuthManager>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = AuthManager(node)
  t.deepEqual(result.defaults, [ { [Authentication]: {
    'example.com': { username: 'User123', password: 'secret1' }
  } } ])
})

test('3 entries', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<AuthManager>
  <collectionProp name="auth_list">
    <elementProp>
      <stringProp name="url">1.example.com</stringProp>
      <stringProp name="username">User123</stringProp>
      <stringProp name="password">secret1</stringProp>
    </elementProp>
    <elementProp>
      <stringProp name="url">2.example.com</stringProp>
      <stringProp name="username">User456</stringProp>
      <stringProp name="password">secret2</stringProp>
    </elementProp>
    <elementProp>
      <stringProp name="url">3.example.com</stringProp>
      <stringProp name="username">User789</stringProp>
      <stringProp name="password">secret3</stringProp>
    </elementProp>
  </collectionProp>
</AuthManager>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = AuthManager(node)
  t.deepEqual(result.defaults, [ { [Authentication]: {
    '1.example.com': { username: 'User123', password: 'secret1' },
    '2.example.com': { username: 'User456', password: 'secret2' },
    '3.example.com': { username: 'User789', password: 'secret3' }
  } } ])
})
