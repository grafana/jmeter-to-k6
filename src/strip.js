function strip(string) {
  const start = string.search(/[^\n]/);
  return start === -1 ? '' : string.substring(start);
}

module.exports = strip;
