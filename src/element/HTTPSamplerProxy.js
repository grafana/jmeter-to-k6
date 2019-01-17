const ind = require('../ind')
const runtimeString = require('../string/run')
const text = require('../text')
const value = require('../value')
const makeResult = require('../result')

function HTTPSamplerProxy (node, context) {
  const result = makeResult()
  if (node.attributes.enabled === 'false') return result
  const settings = {}
  for (const key of Object.keys(node.attributes)) attribute(node, key, result)
  const props = node.children.filter(node => /Prop$/.test(node.name))
  for (const prop of props) property(prop, context, settings)
  if (sufficient(settings)) convert(settings, result, context)
  return result
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
    case 'connect_timeout':
      break
    case 'auto_redirects':
      settings.followSilent = (value(node, context) === 'true')
      break
    case 'comments':
      settings.comment = value(node, context)
      break
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
    case 'follow_redirects': {
      const followLoud = (value(node, context) === 'true')
      if (followLoud) {
        throw new Error('Following redirects with logging not implemented')
      }
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
    case 'protocol':
      settings.protocol = value(node, context)
      break
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

function convert (settings, result, context) {
  result.imports.add('k6/http')
  const params = []
  params.push(method(settings))
  params.push(address(settings))
  const options = renderOptions(settings)
  if (options) params.push(options)
  result.logic = `

`
  if (settings.comment) result.logic += `/* ${settings.comment} */`
  result.logic += `r = http.request(
${ind(params.join(',\n'))}
)`
}

function method (settings) {
  return runtimeString(settings.method)
}

function address (settings) {
  if (settings.address) return runtimeString(settings.address)
  const protocol = `\${${runtimeString(settings.protocol)}}`
  const domain = `\${${runtimeString(settings.domain)}}`
  const path = (settings.path ? `\${${runtimeString(settings.path)}}` : '')
  const port = (settings.port ? `:\${${runtimeString(settings.port)}}` : '')
  return `\`${protocol}://${domain}${port}${path}\``
}

function renderOptions (settings) {
  const items = []
  if (settings.followSilent) items.push(`redirects: 999`)
  else items.push(`redirects: 0`)
  if (settings.responseTimeout) items.push(timeout(settings))
  const headers = renderHeaders(settings)
  if (headers) items.push(headers)
  if (!items.length) return ''
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
  if (!items.length) return ''
  return `headers: {
${ind(items.join(',\n'))}
}`
}

module.exports = HTTPSamplerProxy
