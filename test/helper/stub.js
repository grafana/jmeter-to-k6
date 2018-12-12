const mockRequire = require('mock-require')
const sinon = require('sinon')

/**
 * Stub module
 *
 * Imports named module.
 * Stubs default export.
 * Intercepts module with stub.
 *
 * @param {string} path - Module path. Expects default export function.
 *
 * @return {function} Stubbed procedure.
 */
function stub (path) {
  const original = require(path)
  const stubbed = sinon.stub({ original }, 'original')
  mockRequire(path, stubbed)
  mockRequire.reRequire(path)
  return stubbed
}

module.exports = stub
