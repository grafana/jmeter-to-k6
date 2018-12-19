function makeResult () {
  return {
    options: {},
    imports: new Set(),
    vars: new Map(),
    logic: ''
  }
}

module.exports = makeResult
