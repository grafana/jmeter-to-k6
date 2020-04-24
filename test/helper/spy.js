const loadUncached = require('./load');
const mockRequire = require('mock-require');
const sinon = require('sinon');

/**
 * Spy module
 *
 * Imports named module.
 * Wraps default export in spy.
 * Intercepts module with spy.
 *
 * @param {string} path - Module path. Expects default export function.
 *
 * @return {function} Spied procedure.
 */
function spy(path) {
  const original = loadUncached(path);
  const spied = sinon.spy(original);
  mockRequire(path, spied);
  return spied;
}

module.exports = spy;
