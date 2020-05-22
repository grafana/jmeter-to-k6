/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convert from 'convert';
import fs from 'fs';

test('runtime', async (t) => {
  const xml = fs.readFileSync('test/material/runtime-evaluation.jmx', 'utf8');
  const { main } = await convert(xml);
  t.is(
    main,
    '' +
      `import http from "k6/http";
import { check } from "k6";
import { buffer, iconv, papaparse } from "./libs/compat.js";

const vars = {};
vars["query"] = "CSV_PLACEHOLDER";

const vus = 1;
let csvPage = {},
  csvColumns = {};
let url, opts, r;

const files = {};
files["file.csv"] = open("file.csv", "b");

files["file.csv"] = buffer.Buffer.from([...files["file.csv"]]);
files["file.csv"] = iconv.decode(files["file.csv"], "utf8");
files["file.csv"] = papaparse.parse(files["file.csv"], { delimiter: "," }).data;
csvPage["file.csv"] = 0;
csvColumns["file.csv"] = { query: 0 };

export let options = {
  stages: [
    {
      target: 1,
      duration: "1s",
    },
  ],
};

export default function (data) {
  {
    /*
     * Read CSV line: "file.csv"
     * NOTE: In JMeter all Virtual Users (aka Threads) can read from the same
     * CSVDataSet. In k6 there's no data sharing between VUs. Instead you can
     * use the __VU global variable to help partition the data (if running in
     * the k6 cloud you'll also have to use LI_INSTANCE_ID).
     */
    const path = "file.csv";
    const file = files[path];
    let index = csvPage[path] * vus + __VU - 1;
    if (index >= file.length) {
      if (!csvPage[path]) throw new Error("Missing CSV data for VU " + __VU);
      index = __VU - 1;
      csvPage[path] = 1;
    } else csvPage[path]++;
    const record = file[index];
    for (const name of Object.keys(csvColumns[path])) {
      const index = csvColumns[path][name];
      vars[name] = record[index];
    }
  }

  if (__VU >= 1 && __VU <= 1) {
    if (__ITER < 1) {
      url = ${'`http://example.com?search=${vars[`query`]}`'};
      opts = {
        redirects: 999,
      };
      r = http.request("GET", url, "", opts);
    }
  }
}
`
  );
});
