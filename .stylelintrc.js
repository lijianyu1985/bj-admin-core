const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  rules: {
    "at-rule-no-unknown": false,
    "no-descending-specificity":false
  }
};
