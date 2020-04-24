const properties = require('../common/properties')
const makeResult = require('../result')

function ConfigTestElement (node, context) {
  const result = makeResult()
  const props = properties(node, context, true)
  for (const key of Object.keys(props)) {
    if (props[key] === null) {delete props[key]}
  }
  if ('comments' in props) {
    result.logic = `

/* ${props.comments} */`
    delete props.comments
  }
  const type = node.attributes.guiclass
  switch (type) {
    case 'FtpConfigGui':
      result.defaults.push({ FTPRequestDefaults: props })
      break
    case 'HttpDefaultsGui':
      result.defaults.push({ HTTPRequestDefaults: props })
      break
    case 'LdapConfigGui':
      result.defaults.push({ LDAPRequestDefaults: props })
      break
    case 'LdapExtConfigGui':
      result.defaults.push({ LDAPExtendedRequestDefaults: props })
      break
    case 'LoginConfigGui':
      result.defaults.push({ LoginConfigElement: props })
      break
    case 'SimpleConfigGui': break
    case 'TCPConfigGui':
      result.defaults.push({ TCPSamplerConfig: props })
      break
    default: throw new Error(`Unrecognized ConfigTestElement type: ${  type}`)
  }
  return result
}

module.exports = ConfigTestElement
