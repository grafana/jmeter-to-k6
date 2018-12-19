const isEqual = require('lodash.isequal')

/**
 * Merge conversion results
 *
 * @param {ConvertResult} base - Result to merge into.
 * @param {ConvertResult} update - Changes to merge.
 */
function merge (base, update) {
  if (update.options) Object.assign(base.options, update.options)
  if (update.imports) for (const item of update.imports) base.imports.add(item)
  if (update.vars) mergeVariables(base, update)
  if (update.logic) base.logic += update.logic
}

function mergeVariables (base, update) {
  for (const [ key, spec ] of update.vars) mergeVariable(base, key, spec)
}

function mergeVariable (base, key, spec) {
  if (base.vars.has(key)) {
    if (isEqual(base.vars.get(key), spec)) return
    else throw new Error('Redefinition of variable: ' + key)
  }
  base.vars.set(key, spec)
}

module.exports = merge
