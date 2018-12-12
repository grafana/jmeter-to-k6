const mockRequire = require('mock-require')
const sinon = require('sinon')
const element = require('element')

const elementStub = sinon.stub({ elementStub: element }, 'elementStub')
mockRequire('element', elementStub)
mockRequire.reRequire('element')

module.exports = elementStub
