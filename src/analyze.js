const parseXml = require('@rgrove/parse-xml')
const document = require('./document')

function analyze (xml) {
  return document(parseXml(xml))
}

module.exports = analyze
