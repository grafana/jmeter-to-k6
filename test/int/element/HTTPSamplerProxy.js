/* eslint-disable no-template-curly-in-string */

import test from 'ava'
import parseXml from '@rgrove/parse-xml'
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  '',
  {
    redirects: 0
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}${`/index.html`}`'},
  '',
  {
    redirects: 0
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`http://example.com/index.html`'},
  '',
  {
    redirects: 0
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}:${`88`}`'},
  '',
  {
    redirects: 0
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  '',
  {
    redirects: 0,
    timeout: Number.parseInt(${'`300`'}, 10)
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  '',
  {
    redirects: 0,
    headers: {
      'Content-Encoding': ${'`compress`'}
    }
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  '',
  {
    redirects: 999
  }
)`)
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  ${'`Loved this post.`'},
  {
    redirects: 0
  }
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

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  {
    [${'`forum`'}]: ${'`Dog Training`'},
    [${'`thread`'}]: ${'`How to walk your dog`'},
    [${'`post`'}]: ${'`Loved this post.`'}
  },
  {
    redirects: 0
  }
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
  const file1 = `http.file(files[${'`file1`'}], ${'`file1`'})`
  const file2 = `http.file(` +
    `files[${'`file2`'}], ` +
    `${'`file2`'}, ` +
    `${'`text/plain`'})`
  const file3 = `http.file(` +
    `files[${'`file3`'}], ` +
    `${'`file3`'}, ` +
    `${'`text/html`'})`
  t.is(result.logic, `

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  {
    [${'`file1`'}]: ${file1},
    [${'`file2`'}]: ${file2},
    [${'`file3`'}]: ${file3}
  },
  {
    redirects: 0
  }
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
  const file1 = `http.file(files[${'`file1`'}], ${'`file1`'})`
  const file2 = `http.file(` +
    `files[${'`file2`'}], ` +
    `${'`file2`'}, ` +
    `${'`text/plain`'})`
  const file3 = `http.file(` +
    `files[${'`file3`'}], ` +
    `${'`file3`'}, ` +
    `${'`text/html`'})`
  t.is(result.logic, `

r = http.request(
  ${'`GET`'},
  ${'`${`http`}://${`example.com`}`'},
  {
    [${'`forum`'}]: ${'`Dog Training`'},
    [${'`thread`'}]: ${'`How to walk your dog`'},
    [${'`post`'}]: ${'`Some related files.`'},
    [${'`file1`'}]: ${file1},
    [${'`file2`'}]: ${file2},
    [${'`file3`'}]: ${file3}
  },
  {
    redirects: 0
  }
)`)
})
