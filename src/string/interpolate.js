const makeContext = require("../context");
const match = require("./match");

const left = "(?:^|\\\\\\\\|[^\\\\])\\${";
const right = "}";

function interpolate(input, context = makeContext()) {
  let text = input;
  const ranges = match(text, left, right, "g");
  if (!ranges.length) {
    return text;
  }
  const values = ranges.map((range) => replace(text, range, context));
  for (let i = ranges.length - 1; i > -1; i -= 1) {
    const [start, end] = ranges[i];
    const value = values[i];
    text = splice(text, start, end, value);
  }
  return text;
}

function replace(string, [start, end], context) {
  return evaluate(string.substring(start + 2, end - 1), context);
}

function evaluate(input, context) {
  const text = interpolate(input, context);

  if (text === "") {
    return "";
  }
  if (text.substring(0, 2) === "__") {
    return func(text, context);
  }

  return variable(text, context);
}

function func(string, _context) {
  const name = /^__([^(]+)\(/.exec(string)[1];
  switch (name) {
    case "threadNum":
      throw new Error("__threadNum invalid at convert time");
    default:
      throw new Error(`JMeter function not implemented: __${name}`);
  }
}

function variable(name, context) {
  if (!context.vars.has(name)) {
    throw new Error(`Undefined variable: ${name}`);
  }
  return context.vars.get(name);
}

function splice(string, start, end, substitute) {
  const lead = string.substring(0, start);
  const tail = string.substring(end);
  return lead + substitute + tail;
}

module.exports = interpolate;
