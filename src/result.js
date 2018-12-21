function makeResult () {
  return {
    options: {},
    imports: new Set(),
    vars: new Map(),
    init: '',
    setup: '',
    prolog: '',
    users: [],
    teardown: ''
  }
}

module.exports = makeResult
