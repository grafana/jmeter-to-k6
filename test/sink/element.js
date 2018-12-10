const mockRequire = require('mock-require')
const sinon = require('sinon')

const elementSink = sinon.spy()
mockRequire('element', elementSink)

module.exports = elementSink
