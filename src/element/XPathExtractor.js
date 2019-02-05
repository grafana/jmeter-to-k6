const makeResult = require('../result')

function XPathExtractor (node) {
  const result = makeResult()
  result.logic = `

// There's currently no XPath API in k6 so a pure JS solution has to be used.
// Try https://github.com/google/wicked-good-xpath.`
  return result
}

module.exports = XPathExtractor
