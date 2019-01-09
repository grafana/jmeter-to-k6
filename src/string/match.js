// Derived from MIT licensed version by Steven Levithan
// http://blog.stevenlevithan.com/archives/javascript-match-recursive-regexp

function matchRecursiveRegExp (str, left, right, flags) {
	var	f = flags || "",
		g = f.indexOf("g") > -1,
		x = new RegExp(left + "|" + right, "g" + f),
		l = new RegExp(left, f.replace(/g/g, "")),
		a = [],
		t, s, m;

	do {
		t = 0;
		while (m = x.exec(str)) {
			if (l.test(m[0])) {
				if (!t++) s = x.lastIndex;
			} else if (t) {
				if (!--t) {
          a.push([ s-2, m.index+1 ]);
					if (!g) return a;
				}
			}
		}
	} while (t && (x.lastIndex = s));

	return a;
}

module.exports = matchRecursiveRegExp
