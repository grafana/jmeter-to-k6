// Derived from MIT licensed version by Steven Levithan
// http://blog.stevenlevithan.com/archives/javascript-match-recursive-regexp

function matchRecursiveRegExp(str, left, right, flags) {
  const f = flags || '';
  const g = f.indexOf('g') > -1;
  const x = new RegExp(`${left}|${right}`, (g ? '' : 'g') + f);
  const l = new RegExp(left, f.replace(/g/g, ''));
  const a = [];

  let t;
  let s;
  let m;

  do {
    t = 0;
    // eslint-disable-next-line no-cond-assign
    while ((m = x.exec(str))) {
      if (l.test(m[0])) {
        // eslint-disable-next-line no-plusplus
        if (!t++) {
          s = x.lastIndex;
        }
      } else if (t) {
        // eslint-disable-next-line no-plusplus
        if (!--t) {
          a.push([s - 2, m.index + 1]);
          if (!g) {
            return a;
          }
        }
      }
    }
    // eslint-disable-next-line no-cond-assign
  } while (t && (x.lastIndex = s));

  return a;
}

module.exports = matchRecursiveRegExp;
