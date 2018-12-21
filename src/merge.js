/**
 * Merge conversion results
 *
 * @param {ConvertResult} base - Result to merge into.
 * @param {ConvertResult} update - Changes to merge.
 */
function merge (base, update) {
  if (update.options) mergeOptions(base.options, update.options)
  if (update.imports) for (const item of update.imports) base.imports.add(item)
  if (update.vars) mergeVariables(base, update)
  if (update.init) base.init += update.init
  if (update.setup) base.setup += update.setup
  if (update.prolog) base.prolog += update.prolog
  if (update.users) base.users.push(...update.users)
  if ('logic' in update) mergeLogic(base, update)
}

function mergeOptions (base, update) {
  for (const key of Object.keys(update)) {
    if (Array.isArray(update[key])) {
      if (!(key in base)) base[key] = []
      base[key].push(...update[key])
    } else if (key in base) {
      throw new Error('Redefinition of option: ' + key)
    } else base[key] = update[key]
  }
}

function mergeVariables (base, update) {
  for (const [ key, spec ] of update.vars) mergeVariable(base, key, spec)
}

function mergeVariable (base, key, spec) {
  // JMeter specifies redefinition valid, final definition has precedence
  base.vars.set(key, spec)
}

function mergeLogic (base, update) {
  if (update.user) base.users.push(update.logic)
  else {
    if (!('logic' in base)) base.logic = ''
    base.logic += update.logic
  }
}

module.exports = merge
