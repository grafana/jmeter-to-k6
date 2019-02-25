#!/usr/bin/env node
const fs = require("fs");
const browserify = require("browserify");

const DEPS_DIST_DIR = "vendor";

const DEPS = [
  "buffer",
  "he",
  "iconv-lite",
  "jsonpath",
  "papaparse",
  "perl-regex",
  "yaml"
];

if (!fs.existsSync(DEPS_DIST_DIR)) {
  fs.mkdirSync(DEPS_DIST_DIR);
}

DEPS.forEach(pkgName => {
  const filePath = `${DEPS_DIST_DIR}/${pkgName}.js`;
  browserify()
    .require(`${pkgName}`)
    .bundle()
    .pipe(fs.createWriteStream(filePath));
});

console.log("Vendor built successfully!");
