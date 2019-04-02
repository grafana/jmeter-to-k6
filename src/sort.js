function caseInsensitive (a, b) {
  a = a.toLowerCase()
  b = b.toLowerCase()
  return a > b ? 1 : a < b ? -1 : 0
}

Object.assign(exports, {
  caseInsensitive
})
