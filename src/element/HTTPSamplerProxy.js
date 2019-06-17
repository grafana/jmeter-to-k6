const { Authentication, Check, Delay, Header, Post } = require('../symbol')
const ind = require('../ind')
const literal = require('../literal')
const properties = require('../common/properties')
const runtimeString = require('../string/run')
const string = require('../string/convert')
const text = require('../text')
const value = require('../value')
const makeContext = require('../context')
const makeResult = require('../result')

function HTTPSamplerProxy (node, context = makeContext()) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  result.init = ''
  const settings = { auth: [], headers: new Map(), protocol: '"http"' }
  applyDefaults(settings, context)
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (sufficient(settings)) render(settings, result, context)
  else throw new Error('Invalid HTTPSamplerProxy')
  return result
}

function applyDefaults (settings, context) {
  const { defaults } = context
  for (const scope of defaults) {
    applyLevelDefaults(settings, scope, context)
    applyAuths(settings, scope)
    applyHeaders(settings, scope)
  }
}

function applyLevelDefaults (settings, scope, context) {
  if (!scope.HTTPRequestDefaults) return
  const values = scope.HTTPRequestDefaults
  for (const key of Object.keys(values)) {
    applyDefault(settings, key, values[key], context)
  }
}

function applyDefault (settings, key, value, context) {
  switch (key) {
    case 'BROWSER_COMPATIBLE_MULTIPART':
    case 'concurrentPool':
    case 'connect_timeout':
    case 'DO_MULTIPART_POST':
    case 'implementation':
    case 'ipSource':
    case 'ipSourceType':
    case 'proxyHost':
    case 'proxyPass':
    case 'proxyPort':
    case 'proxyUser':
    case 'use_keepalive':
      break
    case 'Arguments':
      const params = []
      for (const item of value) {
        const param = {}
        for (const key of Object.keys(item)) {
          param[key] = runtimeString(item[key])
        }
        params.push(param)
      }
      settings.params = params
      break
    case 'auto_redirects':
    case 'follow_redirect':
      if (settings.followSilent) break
      settings.followSilent = (string(value, context) === 'true')
      break
    case 'concurrentDwn': {
      const concurrentDownload = (string(value, context) === 'true')
      if (concurrentDownload) {
        throw new Error('Concurrent resource download not implemented')
      }
      break
    }
    case 'contentEncoding':
      settings.contentEncoding = value
      break
    case 'domain':
      settings.domain = value
      break
    case 'embedded_url_re': {
      const referenceConstraint = string(value, context)
      if (referenceConstraint) {
        throw new Error('k6 does not support constraining referenced URLs')
      }
      break
    }
    case 'Files':
      const files = []
      for (const item of value) {
        const file = {}
        for (const key of Object.keys(item)) {
          file[key] = runtimeString(item[key])
        }
      }
      settings.files = files
      break
    case 'md5': {
      const md5 = (string(value, context) === 'true')
      if (md5) throw new Error('Response digesting not implemented')
      break
    }
    case 'method':
      settings.method = value
      break
    case 'path': {
      const path = value
      if (/^https?:\/\//.test(path)) settings.address = path
      else settings.path = path
      break
    }
    case 'port':
      settings.port = value
      break
    case 'postBodyRaw':
      settings.rawBody = (string(value, context) === 'true')
      break
    case 'protocol':
      if (value) settings.protocol = runtimeString(value)
      break
    case 'response_timeout':
      settings.responseTimeout = value
      break
    default: throw new Error('Unrecognized HTTPRequestDefaults value: ' + key)
  }
}

function applyAuths (settings, scope) {
  if (!scope[Authentication] || !scope[Authentication].length) return
  settings.auth = scope[Authentication]
}

function applyHeaders (settings, scope) {
  if (!scope[Header] || !scope[Header].size) return
  settings.headers = scope[Header]
}

function attribute (node, key, result) {
  switch (key) {
    case 'enabled':
    case 'guiclass':
    case 'testclass':
    case 'testname':
      break
    default: throw new Error('Unrecognized HTTPSamplerProxy attribute: ' + key)
  }
}

function property (node, context, settings) {
  const name = node.attributes.name.split('.').pop()
  switch (name) {
    case 'BROWSER_COMPATIBLE_MULTIPART':
    case 'concurrentPool':
    case 'connect_timeout':
    case 'DO_MULTIPART_POST':
    case 'implementation':
    case 'ipSource':
    case 'ipSourceType':
    case 'proxyHost':
    case 'proxyPass':
    case 'proxyPort':
    case 'proxyUser':
    case 'use_keepalive':
      break
    case 'Arguments': {
      const params = []
      const items = node.children.filter(node => /Prop$/.test(node.name))[0]
        .children.filter(node => /Prop$/.test(node.name))
      for (const item of items) params.push(properties(item, context))
      settings.params = params
      break
    }
    case 'auto_redirects':
    case 'follow_redirects':
      if (settings.followSilent) break
      settings.followSilent = (value(node, context) === 'true')
      break
    case 'comments':
      settings.comment = value(node, context)
      break
    case 'concurrentDwn': {
      const concurrentDownload = (value(node, context) === 'true')
      if (concurrentDownload) {
        throw new Error('Concurrent resource download not implemented')
      }
      break
    }
    case 'contentEncoding':
      settings.contentEncoding = text(node.children)
      break
    case 'domain':
      settings.domain = text(node.children)
      break
    case 'embedded_url_re': {
      const referenceConstraint = value(node, context)
      if (referenceConstraint) {
        throw new Error('k6 does not support constraining referenced URLs')
      }
      break
    }
    case 'Files': {
      const files = []
      const items = node.children.filter(node => /Prop$/.test(node.name))[0]
        .children.filter(node => /Prop$/.test(node.name))
      for (const item of items) files.push(properties(item, context))
      settings.files = files
      break
    }
    case 'md5': {
      const md5 = (value(node, context) === 'true')
      if (md5) throw new Error('Response digesting not implemented')
      break
    }
    case 'method':
      settings.method = text(node.children)
      break
    case 'path': {
      const path = text(node.children)
      if (/^https?:\/\//.test(path)) settings.address = path
      else settings.path = path
      break
    }
    case 'port':
      settings.port = text(node.children)
      break
    case 'postBodyRaw':
      settings.rawBody = (value(node, context) === 'true')
      break
    case 'protocol': {
      const protocol = literal(node, context)
      if (protocol) settings.protocol = protocol
      break
    }
    case 'response_timeout':
      settings.responseTimeout = text(node.children)
      break
    default: throw new Error('Unrecognized HTTPSamplerProxy property: ' + name)
  }
}

function sufficient (settings) {
  return (
    settings.method &&
    (
      settings.address ||
      (settings.protocol && settings.domain)
    )
  )
}

function render (settings, result, context) {
  convert(settings, result)
  postProcessors(result, context)
  assertions(result, context)
  delays(result, context)
}

function postProcessors (result, context) {
  for (const level of context.defaults) {
    const post = level[Post]
    if (post && post.length) result.logic += `\n\n${post.join('\n\n')}`
  }
}

function assertions (result, context) {
  result.imports.set('check', { base: 'k6' })
  const checks = []
  for (const level of context.defaults) {
    const levelChecks = level[Check]
    if (!levelChecks) continue
    for (const name of Object.keys(levelChecks)) {
      const logic = `r => { ${levelChecks[name]} }`
      checks.push([ JSON.stringify(name), logic ])
    }
  }
  if (!checks.length) return
  const dict = `{
${ind(checks.map(([ name, logic ]) => `${name}: ${logic}`).join(',\n'))}
}`
  result.logic += `

check(r, ${dict})`
}

function delays (result, context) {
  let delay = false
  for (const level of context.defaults) {
    const timers = level[Delay]
    if (!timers) continue
    else delay = true
    for (const timer of timers) {
      let logic = ''
      if (timer.comment) logic += `/* ${timer.comment} */\n`
      logic += `sleep(${timer.delay / 1000})`
      result.logic += `\n\n${logic}`
    }
  }
  if (delay) result.imports.set('sleep', { base: 'k6' })
}

function convert (settings, result) {
  result.state.add('url')
  result.state.add('opts')
  result.state.add('r')
  result.imports.set('http', 'k6/http')
  const params = []
  const body = renderBody(settings, result)
  params.push(method(settings))
  params.push(`url`)
  params.push(body)
  params.push(`opts`)
  result.logic = `\n\n`
  if (settings.comment) result.logic += `/* ${settings.comment} */\n`
  result.logic += `url = ${address(settings)}
opts = ${renderOptions(settings)}
`
  if (settings.auth.length) result.logic += renderAuth(settings, result)
  if (body === `''`) result.logic += `r = http.request(${params.join(', ')})`
  else result.logic += `r = http.request(\n${ind(params.join(',\n'))}\n)`
}

function method (settings) {
  return runtimeString(settings.method)
}

function address (settings, auth) {
  if (settings.address) return runtimeString(settings.address)
  else if (addressStatic(settings, auth)) return staticAddress(settings)
  else return dynamicAddress(settings, auth)
}

function addressStatic (settings, auth) {
  if (auth) return false
  const items = []
  items.push(settings.protocol)
  items.push(settings.domain)
  if (settings.path) items.push(settings.path)
  if (settings.port) items.push(settings.port)
  return !items.find(item => item[0] === '`')
}

function staticAddress (settings) {
  const protocol = JSON.parse(settings.protocol)
  const domain = settings.domain
  const path = (settings.path || '')
  const port = (settings.port ? `:${settings.port}` : '')
  const raw = `${protocol}://${domain}${port}${path}`
  return JSON.stringify(raw)
}

function dynamicAddress (settings, auth) {
  const protocol = component(JSON.parse(settings.protocol))
  const domain = component(settings.domain)
  const path = (settings.path ? component(settings.path) : '')
  const port = (settings.port ? `:${component(settings.port)}` : '')
  const credential = (auth ? `\${username}:\${password}@` : '')
  return `\`${protocol}://${credential}${domain}${port}${path}\``
}

function component (string) {
  if (string[0] === '`') return `\${${string}}`
  else return staticComponent(string)
}

function staticComponent (string) {
  return string.replace('\\', '\\\\').replace('`', '\\`')
}

function renderBody (settings, result) {
  if (!(settings.params || settings.files)) return `''`
  if (settings.rawBody) return renderRawBody(settings.params)
  else return renderStructuredBody(settings.params, settings.files, result)
}

function renderRawBody (params) {
  const node = params[0]
  const value = node.value.split(/\r\n|\r|\n/).join('\r\n')
  return value
}

function renderStructuredBody (params, files, result) {
  const items = []
  items.push(...renderParams(params))
  items.push(...renderFiles(files, result))
  if (!items.length) return `''`
  return `{
${ind(items.join(',\n'))}
}`
}

function renderParams (params, result) {
  return (params ? params.map(node => renderParam(node)) : [])
}

function renderParam (node) {
  if (!node.name) throw new Error('Query parameter missing name')
  return `[${node.name}]: ${node.value}`
}

function renderFiles (nodes, result) {
  if (!nodes) return []
  const files = []
  for (const node of nodes) renderFile(node, result, files)
  return files
}

function renderFile (node, result, files) {
  if (!(node.path && node.paramname)) return
  result.imports.set('http', 'k6/http')
  result.files.set(node.paramname, { path: node.path, binary: true })
  const name = node.paramname
  const params = []
  params.push(`files[${name}]`)
  params.push(`${name}`)
  if (node.mimetype) params.push(node.mimetype)
  const value = `http.file(${params.join(', ')})`
  files.push(`[${name}]: ${value}`)
}

function renderOptions (settings, result) {
  const items = []
  if (settings.followSilent) items.push(`redirects: 999`)
  else items.push(`redirects: 0`)
  if (settings.responseTimeout) items.push(timeout(settings))
  const headers = renderHeaders(settings)
  if (headers) items.push(headers)
  if (!items.length) return `null`
  return `{
${ind(items.join(',\n'))}
}`
}

function timeout (settings) {
  const value = runtimeString(settings.responseTimeout)
  return `timeout: Number.parseInt(${value}, 10)`
}

function renderHeaders (settings) {
  const items = []
  if (settings.contentEncoding) {
    const value = runtimeString(settings.contentEncoding)
    const header = `'Content-Encoding': ${value}`
    items.push(header)
  }
  if (settings.headers) {
    for (const [ name, value ] of settings.headers) {
      const header = `[${name}]: ${value}`
      items.push(header)
    }
  }
  if (!items.length) return ''
  return `headers: {
${ind(items.join(',\n'))}
}`
}

function renderAuth (settings, result) {
  result.state.add('auth')
  const credentials = renderCredentials(settings.auth)
  return `if (auth = ${credentials}.find(item => url.includes(item.url))) {
  const username = encodeURIComponent(auth.username)
  const password = encodeURIComponent(auth.password)
  url = ${address(settings, true)}
  opts.auth = auth.mechanism
}
`
}

function renderCredentials (auth) {
  const credentials = []
  for (const credential of auth) credentials.push(renderCredential(credential))
  return `[
${ind(credentials.join(',\n'))}
]`
}

function renderCredential (credential) {
  const items = []
  items.push(`url: ${credential.url}`)
  items.push(`username: ${credential.username}`)
  items.push(`password: ${credential.password}`)
  items.push(`mechanism: ${renderMechanism(credential.mechanism)}`)
  return `{ ${items.join(', ')} }`
}

function renderMechanism (mechanism) {
  if (!mechanism) return `"basic"`
  switch (mechanism) {
    case 'BASIC': return `"basic"`
    case 'DIGEST': return `"digest"`
    case 'KERBEROS': return `"ntlm"`
    default: throw new Error('Unsupported auth mechanism: ' + mechanism)
  }
}

module.exports = HTTPSamplerProxy
