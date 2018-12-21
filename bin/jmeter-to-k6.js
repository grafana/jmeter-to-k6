#!/usr/bin/env node

const fs = require('fs')
const yargs = require('yargs')
const convert = require('../src/convert')

const argv = yargs
  .usage('jmeter-to-k6 <jmx-file>')
  .argv

function exit () {
  yargs.showHelp()
  process.exit(1)
}

const path = argv._[0] || exit()
const jmx = fs.readFileSync(path, { encoding: 'utf8' })
const script = convert(jmx)
console.log(script)
