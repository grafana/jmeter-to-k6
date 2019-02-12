#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const convert = require('../src/convert')

const argv = yargs
  .usage('jmeter-to-k6 <jmx-file>')
  .argv

function exit () {
  yargs.showHelp()
  process.exit(1)
}

const compatInput = path.join(__dirname, '../file/jmeter-compat.js')
const input = argv._[0] || exit()
const compatOutput = path.join('.', 'jmeter-compat.js')

fs.copyFileSync(compatInput, compatOutput)
const jmx = fs.readFileSync(input, { encoding: 'utf8' })
const script = convert(jmx)
console.log(script)
