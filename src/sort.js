function caseInsensitive(a, b) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (left > right) {
    return 1;
  }
  if (left < right) {
    return -1;
  }
  return 0;
}

Object.assign(exports, {
  caseInsensitive,
});
