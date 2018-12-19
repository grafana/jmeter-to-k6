/**
 * Merge conversion results
 *
 * @param {ConvertResult} base - Result to merge into.
 * @param {ConvertResult} update - Changes to merge.
 */
function merge (base, update) {
  if (update.options) Object.assign(base.options, update.options)
  if (update.imports) for (const item of update.imports) base.imports.add(item)
  if (update.declares) base.declares += update.declares
  if (update.logic) base.logic += update.logic
}

module.exports = merge
