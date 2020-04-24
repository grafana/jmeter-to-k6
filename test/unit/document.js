import test from 'ava';
import element from 'stub/element';
import document from 'document';

const tree = {
  type: 'document',
  children: [
    {
      type: 'element',
      name: 'jmeterTestPlan',
      children: [],
    },
  ],
};

test.beforeEach((t) => {
  element.reset();
});

test.serial('root', (t) => {
  document(tree);
  t.true(element.calledOnce);
  t.deepEqual(element.firstCall.args[0], tree.children[0]);
});

test.serial('return', (t) => {
  const token = Symbol('TestToken');
  element.returns(token);
  const result = document(tree);
  t.is(result, token);
});
