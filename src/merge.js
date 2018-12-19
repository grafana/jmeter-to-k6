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
  for (const [ key, value ] of update.vars) mergeVariable(base, key, value)
}

function mergeVariable (base, key, value) {
  if (base.vars.has(key) && base.vars.get(key) !== value) {
    throw new Error('Redefinition of variable: ' + key)
  }
  base.vars.set(key, value)
}

module.exports = merge
