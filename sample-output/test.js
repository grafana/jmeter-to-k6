import http from "k6/http";
import { check } from "k6";
import { perlRegex } from "./libs/compat.js";

let url, opts, r;

// Element skipped: jmeterTestPlan.hashTree.TestPlan.hashTree.ResultCollector

export let options = {
  stages: [{ target: 1, duration: "1s" }]
};

export default function(data) {
  if (__VU >= 1 && __VU <= 1) {
    if (__ITER < 100) {
      url = "https://test.k6.io:443";
      opts = {
        redirects: 999
      };
      r = http.request("GET", url, "", opts);

      check(r, {
        "Response Assertion": r => {
          return perlRegex.match(r.status, "200", "s");
        }
      });
    }
  }
}
