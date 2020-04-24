const loadUncached = require('./load');
const mockRequire = require('mock-require');
const sinon = require('sinon');

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
function stub(path) {
  const original = loadUncached(path);
  const stubbed = sinon.stub({ original }, 'original');
  mockRequire(path, stubbed);
  return stubbed;
}

module.exports = stub;
