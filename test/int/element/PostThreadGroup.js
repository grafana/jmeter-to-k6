import test from 'ava';
import parseXml from '@rgrove/parse-xml';
import empty from 'helper/empty';
import document from 'document';

test('empty', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <PostThreadGroup/>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`;
  const tree = parseXml(xml);
  const result = document(tree);
  t.deepEqual(result, empty);
});

test('comment', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.0 r1840935">
  <hashTree>
    <TestPlan>
      <PostThreadGroup>
        <stringProp name="ThreadGroup.comments">Close resources</stringProp>
      </PostThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>
`;
  const tree = parseXml(xml);
  const result = document(tree);
  t.is(
    result.teardown,
    `

/* Close resources */`
  );
});
