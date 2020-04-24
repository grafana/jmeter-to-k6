function expand (array) {
  const expanded = []
  for (const item of array) {
    if (Array.isArray(item)) {expanded.push(...item)}
    else {expanded.push(item)}
  }
  return expanded
}

module.exports = expand
