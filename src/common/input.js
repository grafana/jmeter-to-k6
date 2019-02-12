function renderInput (component, result) {
  switch (component) {
    case 'as_document': throw new Error('Apache Tika extraction not supported')
    case 'code': return `r.status` // Response status code
    case 'false': return `r.body` // Request body
    case 'message':
      // Response status message
      throw new Error('Response status message not accessible')
    case 'request_headers': return `r.request.headers` // Request headers
    case 'true': return `r.headers` // Response headers
    case 'unescaped':
      // Request body with HTML entities decoded
      result.imports.set('he', { base: './jmeter-compat.js' })
      return `he.decode(r.body)`
    case 'URL': return `r.request.url` // Request address
    default:
      throw new Error('Unrecognized input: ' + component)
  }
}

module.exports = renderInput
