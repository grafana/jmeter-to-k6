const decache = require('decache')

/**
 * Load module without caching
 *
 * @param {string} path - Module path.
 *
 * @return Module default export.
 */
function loadUncached (path) {
  const module = require(path)
  decache(path)
  return module
}

module.exports = loadUncached
