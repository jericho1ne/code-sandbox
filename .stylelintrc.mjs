export default {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  plugins: [
    'stylelint-order',
    '@stylistic/stylelint-plugin',
  ],
  rules: {
    'order/properties-alphabetical-order': true,
    '@stylistic/indentation': [2, { baseIndentLevel: 0 }],
    'custom-property-no-missing-var-function': true,
    // Disable the following rules
    'no-descending-specificity': null,
  },
}
