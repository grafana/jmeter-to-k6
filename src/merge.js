/**
 * Merge conversion results
 *
 * @param {ConvertResult} base - Result to merge into.
 * @param {ConvertResult} update - Changes to merge.
 */
function merge (base, update) {
  Object.assign(base.options, update.options)
  for (const item of update.imports) base.imports.add(item)
  base.logic += update.logic
}

module.exports = merge
