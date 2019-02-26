#!/usr/bin/env node
const fs = require("fs-extra");
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

fs.ensureDirSync(DEPS_DIST_DIR);

DEPS.forEach(pkgName => {
  const filePath = `${DEPS_DIST_DIR}/${pkgName}.js`;
  browserify({ standalone: pkgName })
    .require(pkgName)
    .bundle()
    .pipe(fs.createWriteStream(filePath));
});

console.log("Vendor built successfully!");
