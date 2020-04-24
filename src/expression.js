const variable = /(?:^|\\\\|[^\\])\${(.*)}/;
const variables = /(?:^|\\\\|[^\\])\${(.*)}/g;

Object.assign(exports, {
  variable,
  variables,
});
