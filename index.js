const postcss = require('postcss')

const SAFE_AREA_VARS = ['safe-area-inset-top', 'safe-area-inset-bottom',
  'safe-area-inset-left', 'safe-area-inset-right'];

module.exports = postcss.plugin('postcss-safe-area', () => {
  return (root) => {
    root.walkDecls(decl => {
      const vars = decl.value.match(/env\(([\w-]+)\)/g) || [];
      const match = SAFE_AREA_VARS.some(s => vars.includes(`env(${s})`));
      if (!match) return;

      let fallback1 = decl.value;
      let fallback2 = decl.value;

      for (const key of SAFE_AREA_VARS) {
        const regex = new RegExp(`env\\(${key}\\)`, 'g');
        fallback1 = fallback1.replace(regex, '0px');
        fallback2 = fallback2.replace(regex, `constant(${key})`);
      }

      decl.before(`${decl.prop}:${fallback1}`);
      decl.before(`${decl.prop}:${fallback2}`);
    });
  }
})
