function makeResult () {
  return {
    options: {},
    imports: new Set(),
    vars: new Map(),
    constants: new Map(),
    files: new Map(),
    cookies: new Map(),
    defaults: [],
    init: '',
    setup: '',
    prolog: '',
    users: [],
    teardown: ''
  }
}

module.exports = makeResult
