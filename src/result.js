function makeResult () {
  return {
    options: {},
    imports: new Set(),
    vars: new Map(),
    setup: '',
    prolog: '',
    users: []
  }
}

module.exports = makeResult
