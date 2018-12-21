function makeResult () {
  return {
    options: {},
    imports: new Set(),
    vars: new Map(),
    prolog: '',
    users: []
  }
}

module.exports = makeResult
