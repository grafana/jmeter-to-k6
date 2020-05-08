const match = require('./match');

const left = '(?:^|\\\\\\\\|[^\\\\])\\${';
const right = '}';

function replace(string, [start, end]) {
  return evaluate(string.substring(start + 2, end - 1));
}

function evaluate(string) {
  if (string === '') {
    return '';
  }

  if (string.substring(0, 2) === '__') {
    // console.log('here');

    return func(string);
  }

  return variable(string);
}

function func(string) {
  const name = /^__([^(])\(/.exec(string)[1];
  switch (name) {
    case 'threadNum':
      return '__VU';
    case 'P':
      return `vars["${string.replace(/__P\((.*)\)/, '$1')}"]`;
    default:
      throw new Error(`JMeter function not implemented: __${name}`);
  }
}

function variable(name) {
  return `vars[${render(name)}]`;
}

function splice(string, start, end, substitute) {
  const lead = string.substring(0, start);
  const tail = string.substring(end);
  return [lead, '${', substitute, '}', tail].join('');
}

function render(input) {
  let text = input;
  const ranges = match(text, left, right, 'g');
  if (!ranges.length) {
    return `\`${text.replace('`', '\\`')}\``;
  }
  const values = ranges.map((range) => replace(text, range));
  for (let i = ranges.length - 1; i > -1; i -= 1) {
    const [start, end] = ranges[i];
    const value = values[i];
    text = splice(text, start, end, value);
  }
  return `\`${text}\``;
}

module.exports = render;
