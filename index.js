const postcss = require('postcss');
const browserslist = require('browserslist');
const caniuse = require('caniuse-lite');

// Apple vars
const vars = [
  'safe-area-inset-top',
  'safe-area-inset-bottom',
  'safe-area-inset-left',
  'safe-area-inset-right',
];

module.exports = postcss.plugin('postcss-safe-area', () => {

  // Get browser capabilities
  const browsers = browserslist();
  const stats = caniuse.feature(caniuse.features['css-env-function']).stats;
  const capabilities = browsers.map(browser => {
    const [ vendor, version ] = browser.split(' ');
    return stats[vendor][version];
  });
  const useConstantFunction = capabilities.some(capability => capability === 'a #1');
  const useDefaultValue = capabilities.some(capability => capability === 'n');
  if (!useConstantFunction && !useDefaultValue) {
    return () => {};
  }

  // Detects env(..., ...)
  const expr = new RegExp(`env\\(\\s*(${vars.join('|')})\\s*,?\\s*([^)]+)?\\s*\\)`, 'g');
  return root => {
    root.walkDecls(decl => {
      // env(..., 1px) -> 1px
      if (useDefaultValue) {
        const fallback = decl.value.replace(expr, (match, param, defaultValue) => {
          return defaultValue || '0';
        });
        if (fallback === decl.value) {
          return;
        }
        decl.before(`${decl.prop}:${fallback}`);
      }

      // env(...) -> constant(...)
      if (useConstantFunction) {
        const fallback = decl.value.replace(expr, (match, param, defaultValue) => {
          return `constant(${param}${defaultValue ? `, ${defaultValue}` : ''})`;
        });
        if (fallback === decl.value) {
          return;
        }
        decl.before(`${decl.prop}:${fallback}`);
      }
    });
  };
});
