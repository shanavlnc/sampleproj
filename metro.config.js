// metro.config.js

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    resolver: {
      extraNodeModules: {
        'lodash/isEqual': require.resolve('lodash.isequal')
      },
      assetExts,
      sourceExts
    }
  };
})();
