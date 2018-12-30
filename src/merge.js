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
  if (update.defaults) base.defaults.push(...update.defaults)
  if (update.init) base.init += update.init
  if (update.setup) base.setup += update.setup
  if (update.prolog) base.prolog += update.prolog
  if (update.users) base.users.push(...update.users)
  if (update.teardown) base.teardown += update.teardown
  if ('logic' in update) mergeLogic(base, update)
}

function mergeOptions (base, update) {
  for (const key of Object.keys(update)) mergeOption(base, update, key)
}

function mergeOption (base, update, key) {
  switch (key) {
    case 'linger':
    case 'paused':
      if (key in base) throw new Error('Redefinition of option: ' + key)
      base[key] = update[key]
      break
    case 'hosts':
      if (!base.hosts) base.hosts = {}
      Object.assign(base.hosts, update.hosts)
      break
    case 'stages':
      if (!base.stages) base.stages = []
      base.stages.push(...update.stages)
      break
    default: throw new Error('Unrecognized option: ' + key)
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
