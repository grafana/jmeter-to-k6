module.exports = (format, val) => {
  let output = '';

  const formatParts = format.split('.');
  const valueParts = val.toString().split('.');

  output += formatIntegers(formatParts[0], valueParts[0]);

  if (formatParts[1]) {
    output += `.${formatFractions(
      formatParts[1],
      valueParts[1] || formatParts[1]
    )}`;
  }

  return output;
};

function formatFractions(format, value) {
  let output = '';
  const digits = value.split('');

  for (let i = 0; i < format.length; i += 1) {
    if (format[i] !== '0' || digits.length <= 0) {
      output += format[i];
      continue;
    }
    output += `${digits.shift()}`;
  }
  return output;
}

function formatIntegers(formatPart, valuePart) {
  let output = '';
  const digits = valuePart.split('');
  for (let i = formatPart.length - 1; i >= 0; i -= 1) {
    if (formatPart[i] !== '0' || digits.length <= 0) {
      output = `${formatPart[i]}${output}`;
    } else {
      output = `${digits.pop()}${output}`;
    }
  }
  return output;
}
