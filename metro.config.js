// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    resolver: {
      extraNodeModules: {
        'lodash/isEqual': require.resolve('lodash.isequal'),
      },
      assetExts: defaultConfig.resolver.assetExts,
      sourceExts: defaultConfig.resolver.sourceExts,
    },
  };
})();
