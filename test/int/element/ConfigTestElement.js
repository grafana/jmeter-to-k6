import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import ConfigTestElement from 'element/ConfigTestElement'

test('comment', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="SimpleConfigGui">
  <stringProp name="comments">Default to standard port</stringProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.logic, `

/* Default to standard port */`)
})

test('FTPRequestDefaults', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="FtpConfigGui">
  <stringProp name="FTPSampler.server">localhost</stringProp>
  <stringProp name="FTPSampler.port">765</stringProp>
  <stringProp name="FTPSampler.filename">WorldDominationPlan.txt</stringProp>
  <stringProp name="FTPSampler.localfilename">InnocentDocument.txt</stringProp>
  <boolProp name="FTPSampler.binarymode">false</boolProp>
  <boolProp name="FTPSampler.saveresponse">false</boolProp>
  <boolProp name="FTPSampler.upload">false</boolProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { FTPRequestDefaults: {
    server: 'localhost',
    port: '765',
    filename: 'WorldDominationPlan.txt',
    localfilename: 'InnocentDocument.txt',
    binarymode: false,
    saveresponse: false,
    upload: false
  } } ])
})

test('HTTPRequestDefaults', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="HttpDefaultsGui">
  <stringProp name="domain">httpbin.org</stringProp>
  <stringProp name="port">80</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="contentEncoding">gzip</stringProp>
  <stringProp name="path">/get</stringProp>
  <stringProp name="concurrentPool">6</stringProp>
  <stringProp name="connect_timeout">1000</stringProp>
  <stringProp name="response_timeout">2000</stringProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { HTTPRequestDefaults: {
    domain: 'httpbin.org',
    port: '80',
    protocol: 'http',
    contentEncoding: 'gzip',
    path: '/get',
    concurrentPool: '6',
    connect_timeout: '1000',
    response_timeout: '2000'
  } } ])
})

test('LDAPExtendedRequestDefaults', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="LdapExtConfigGui">
  <stringProp name="servername"></stringProp>
  <stringProp name="port"></stringProp>
  <stringProp name="rootdn"></stringProp>
  <stringProp name="scope">2</stringProp>
  <stringProp name="countlimit"></stringProp>
  <stringProp name="timelimit"></stringProp>
  <stringProp name="attributes"></stringProp>
  <stringProp name="return_object">false</stringProp>
  <stringProp name="deref_aliases">false</stringProp>
  <stringProp name="connection_timeout"></stringProp>
  <stringProp name="parseflag">false</stringProp>
  <stringProp name="secure">false</stringProp>
  <stringProp name="user_dn"></stringProp>
  <stringProp name="user_pw"></stringProp>
  <stringProp name="comparedn"></stringProp>
  <stringProp name="comparefilt"></stringProp>
  <stringProp name="modddn"></stringProp>
  <stringProp name="newdn"></stringProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { LDAPExtendedRequestDefaults: {
    scope: '2',
    'return_object': 'false',
    'deref_aliases': 'false',
    parseflag: 'false',
    secure: 'false'
  } } ])
})

test('LDAPRequestDefaults', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="LdapConfigGui">
  <stringProp name="servername">localhost</stringProp>
  <stringProp name="port">767</stringProp>
  <boolProp name="user_defined">false</boolProp>
  <stringProp name="test">add</stringProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { LDAPRequestDefaults: {
    servername: 'localhost',
    port: '767',
    'user_defined': false,
    test: 'add'
  } } ])
})

test('LoginConfigElement', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="LoginConfigGui">
  <stringProp name="ConfigTestElement.username">BoatRocker787</stringProp>
  <stringProp name="ConfigTestElement.password">rockthisboat</stringProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { LoginConfigElement: {
    username: 'BoatRocker787',
    password: 'rockthisboat'
  } } ])
})

test('TCPSamplerConfig', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ConfigTestElement guiclass="TCPConfigGui">
  <stringProp name="TCPSampler.server">localhost</stringProp>
  <boolProp name="TCPSampler.reUseConnection">true</boolProp>
  <stringProp name="TCPSampler.port">799</stringProp>
  <boolProp name="TCPSampler.nodelay">false</boolProp>
  <stringProp name="TCPSampler.timeout"></stringProp>
  <stringProp name="TCPSampler.request"></stringProp>
  <boolProp name="TCPSampler.closeConnection">false</boolProp>
</ConfigTestElement>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = ConfigTestElement(node)
  t.deepEqual(result.defaults, [ { TCPSamplerConfig: {
    server: 'localhost',
    reUseConnection: true,
    port: '799',
    nodelay: false,
    closeConnection: false
  } } ])
})
