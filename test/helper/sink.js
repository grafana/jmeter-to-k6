const mockRequire = require('mock-require');
const sinon = require('sinon');

/**
 * Sink module
 *
 * Intercepts module with anonymous spy.
 *
 * @param {string} path - Module path. Expects default export function.
 *
 * @return {function} Anonymous spy.
 */
function sink(path) {
  const sinked = sinon.spy();
  mockRequire(path, sinked);
  return sinked;
}

module.exports = sink;
