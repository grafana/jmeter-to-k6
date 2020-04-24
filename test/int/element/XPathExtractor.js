import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import XPathExtractor from 'element/XPathExtractor';

test('comment', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<XPathExtractor/>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = XPathExtractor(node);
  t.is(
    result.logic,
    `

// There's currently no XPath API in k6 so a pure JS solution has to be used.
// Try https://github.com/google/wicked-good-xpath.`
  );
});
