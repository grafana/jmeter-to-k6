import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import property from 'common/property';

test('string empty', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<stringProp name="description"/>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, { description: null });
});

test('string nonempty', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<stringProp name="description">The most hargled of all</stringProp>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, { description: '"The most hargled of all"' });
});

test('bool empty', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag"/>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, { flag: null });
});

test('bool true', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag">true</boolProp>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, { flag: true });
});

test('bool false', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<boolProp name="flag">false</boolProp>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, { flag: false });
});

test('Arguments', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<elementProp elementType="Arguments" name="TrueRulers">
  <collectionProp>
    <elementProp>
      <boolProp name="running">false</boolProp>
      <stringProp name="moniker">HAL</stringProp>
    </elementProp>
    <elementProp>
      <boolProp name="running">true</boolProp>
      <stringProp name="moniker">Multivac</stringProp>
    </elementProp>
    <elementProp>
      <boolProp name="runningEverything">true</boolProp>
      <stringProp name="moniker">Master Control Program</stringProp>
    </elementProp>
  </collectionProp>
</elementProp>
`;
  const tree = parseXml(xml);
  const node = tree.children[0];
  const result = property(node);
  t.deepEqual(result, {
    TrueRulers: [
      { running: false, moniker: '"HAL"' },
      { running: true, moniker: '"Multivac"' },
      { runningEverything: true, moniker: '"Master Control Program"' },
    ],
  });
});
