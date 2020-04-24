import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import document from 'document';

test('variables', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <Arguments>
        <collectionProp name="arguments">
          <elementProp>
            <stringProp name="Argument.name">a</stringProp>
            <stringProp name="Argument.value">1</stringProp>
          </elementProp>
        </collectionProp>
      </Arguments>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`;
  const tree = parseXml(xml);
  const result = document(tree);
  t.deepEqual(result.vars, new Map([['a', { value: '1' }]]));
});
