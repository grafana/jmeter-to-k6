/* eslint-disable no-template-curly-in-string */

import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import document from 'document'
import HTTPSamplerProxy from 'element/HTTPSamplerProxy'

test('minimal', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request("GET", url, '', opts)`)
})

test('path', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <stringProp name="path">/index.html</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com/index.html"
opts = {
  redirects: 0
}
r = http.request("GET", url, '', opts)`)
})

test('address in path', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="path">http://example.com/index.html</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com/index.html"
opts = {
  redirects: 0
}
r = http.request("GET", url, '', opts)`)
})

test('port', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <stringProp name="port">88</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com:88"
opts = {
  redirects: 0
}
r = http.request("GET", url, '', opts)`)
})

test('timeout', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <stringProp name="response_timeout">300</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0,
  timeout: Number.parseInt("300", 10)
}
r = http.request("GET", url, '', opts)`)
})

test('encoding', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <stringProp name="contentEncoding">compress</stringProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0,
  headers: {
    'Content-Encoding': "compress"
  }
}
r = http.request("GET", url, '', opts)`)
})

test('redirect silent', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <boolProp name="auto_redirects">true</boolProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 999
}
r = http.request("GET", url, '', opts)`)
})

test('body', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <boolProp name="postBodyRaw">true</boolProp>
  <elementProp name="Arguments">
    <collectionProp>
      <elementProp>
        <stringProp name="value">Loved this post.</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request(
  "GET",
  url,
  "Loved this post.",
  opts
)`)
})

test('params', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <elementProp name="Arguments">
    <collectionProp>
      <elementProp>
        <stringProp name="name">forum</stringProp>
        <stringProp name="value">Dog Training</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">thread</stringProp>
        <stringProp name="value">How to walk your dog</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">post</stringProp>
        <stringProp name="value">Loved this post.</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request(
  "GET",
  url,
  {
    ["forum"]: "Dog Training",
    ["thread"]: "How to walk your dog",
    ["post"]: "Loved this post."
  },
  opts
)`)
})

test('files', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <elementProp name="Files">
    <collectionProp>
      <elementProp>
        <stringProp name="path">/home/user/file1</stringProp>
        <stringProp name="paramname">file1</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="path">/home/user/file2</stringProp>
        <stringProp name="paramname">file2</stringProp>
        <stringProp name="mimetype">text/plain</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="path">/home/user/file3</stringProp>
        <stringProp name="paramname">file3</stringProp>
        <stringProp name="mimetype">text/html</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  const file1 = `http.file(files["file1"], "file1")`
  const file2 = `http.file(` +
    `files["file2"], ` +
    `"file2", ` +
    `"text/plain")`
  const file3 = `http.file(` +
    `files["file3"], ` +
    `"file3", ` +
    `"text/html")`
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request(
  "GET",
  url,
  {
    ["file1"]: ${file1},
    ["file2"]: ${file2},
    ["file3"]: ${file3}
  },
  opts
)`)
})

test('params files', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HTTPSamplerProxy>
  <stringProp name="method">GET</stringProp>
  <stringProp name="protocol">http</stringProp>
  <stringProp name="domain">example.com</stringProp>
  <elementProp name="Arguments">
    <collectionProp>
      <elementProp>
        <stringProp name="name">forum</stringProp>
        <stringProp name="value">Dog Training</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">thread</stringProp>
        <stringProp name="value">How to walk your dog</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">post</stringProp>
        <stringProp name="value">Some related files.</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
  <elementProp name="Files">
    <collectionProp>
      <elementProp>
        <stringProp name="path">/home/user/file1</stringProp>
        <stringProp name="paramname">file1</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="path">/home/user/file2</stringProp>
        <stringProp name="paramname">file2</stringProp>
        <stringProp name="mimetype">text/plain</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="path">/home/user/file3</stringProp>
        <stringProp name="paramname">file3</stringProp>
        <stringProp name="mimetype">text/html</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = HTTPSamplerProxy(node)
  const file1 = `http.file(files["file1"], "file1")`
  const file2 = `http.file(` +
    `files["file2"], ` +
    `"file2", ` +
    `"text/plain")`
  const file3 = `http.file(` +
    `files["file3"], ` +
    `"file3", ` +
    `"text/html")`
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request(
  "GET",
  url,
  {
    ["forum"]: "Dog Training",
    ["thread"]: "How to walk your dog",
    ["post"]: "Some related files.",
    ["file1"]: ${file1},
    ["file2"]: ${file2},
    ["file3"]: ${file3}
  },
  opts
)`)
})

test.only('defaults', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <ConfigTestElement guiclass="HttpDefaultsGui">
    <stringProp name="protocol">https</stringProp>
    <stringProp name="domain">example.com</stringProp>
  </ConfigTestElement>
  <HTTPSamplerProxy>
    <stringProp name="method">GET</stringProp>
    <stringProp name="protocol">http</stringProp>
  </HTTPSamplerProxy>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

url = "http://example.com"
opts = {
  redirects: 0
}
r = http.request("GET", url, '', opts)`)
})

test('auth', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
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
  <HTTPSamplerProxy>
    <stringProp name="method">GET</stringProp>
    <stringProp name="protocol">http</stringProp>
    <stringProp name="domain">2.example.com</stringProp>
  </HTTPSamplerProxy>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

url = "http://2.example.com"
opts = {
  redirects: 0
}
if (auth = [
  { url: "1.example.com", username: "User123", password: "secret1", mechanism: "basic" },
  { url: "2.example.com", username: "User456", password: "secret2", mechanism: "basic" },
  { url: "3.example.com", username: "User789", password: "secret3", mechanism: "basic" }
].find(item => url.includes(item.url))) {
  const username = encodeURIComponent(auth.username)
  const password = encodeURIComponent(auth.password)
  url = ${'`http://${username}:${password}@2.example.com`'}
  opts.auth = auth.mechanism
}
r = http.request("GET", url, '', opts)`)
})

test('headers', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <HeaderManager>
    <collectionProp name="headers">
      <elementProp>
        <stringProp name="name">User-Agent</stringProp>
        <stringProp name="value">k6-load-tester</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">Accept-Charset</stringProp>
        <stringProp name="value">utf-8</stringProp>
      </elementProp>
      <elementProp>
        <stringProp name="name">Accept-Encoding</stringProp>
        <stringProp name="value">gzip, deflate</stringProp>
      </elementProp>
    </collectionProp>
  </HeaderManager>
  <HTTPSamplerProxy>
    <stringProp name="method">GET</stringProp>
    <stringProp name="protocol">http</stringProp>
    <stringProp name="domain">2.example.com</stringProp>
  </HTTPSamplerProxy>
</jmeterTestPlan>
`
  const tree = parseXml(xml)
  const result = document(tree)
  t.is(result.logic, `

url = "http://2.example.com"
opts = {
  redirects: 0,
  headers: {
    ["User-Agent"]: "k6-load-tester",
    ["Accept-Charset"]: "utf-8",
    ["Accept-Encoding"]: "gzip, deflate"
  }
}
r = http.request("GET", url, '', opts)`)
})
