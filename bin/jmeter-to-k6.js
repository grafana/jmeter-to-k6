#!/usr/bin/env node
const chalk = require('chalk');
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");
const convert = require("../src/convert");

const argv = yargs
  .usage("jmeter-to-k6 <jmx-file>")
  .usage("jmeter-to-k6 <jmx-file> -o <k6-file>")
  .option("out", {
    alias: "o",
    describe: "Output file",
    type: "string"
  }).argv;

function exit() {
  yargs.showHelp();
  process.exit(1);
}

(async () => {
  const input = argv._[0] || exit();
  const output = argv.out;

  const jmx = fs.readFileSync(input, { encoding: "utf8" });
  const { main, compat } = await convert(jmx);


  if (output) {
    console.log(`Starting conversion of: ${chalk.green(path.resolve(input))}\n`);
    fs.ensureDirSync(output);
    if (compat) {
      fs.ensureDirSync(`${output}/libs`)
      fs.writeFileSync(`${output}/libs/compat.js`, compat)
    }

    fs.outputFileSync(`${output}/test.js`, main);
    console.log(`Success! Created test at ${chalk.green(path.resolve(`${output}/test.js`))}`);
  } else {
    console.log(`Please specify the output directory: \n  ${chalk.cyan("jmeter-to-k6")} ${chalk.green("-o <output-dir> <jmx-file>")}\n`);
    console.log(`For example: \n  ${chalk.cyan("jmeter-to-k6")} ${chalk.green("-o load-test")} ${chalk.green("/path/to/some.jmx")}`);
  }
})();
