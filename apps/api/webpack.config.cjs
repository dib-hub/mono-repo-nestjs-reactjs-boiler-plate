const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

module.exports = composePlugins(withNx(), (config) => {
  config.resolve = config.resolve || {};

  // Resolve .js imports to .ts files (required for Prisma generated ESM-style imports)
  config.resolve.extensionAlias = {
    '.js': ['.ts', '.js'],
    '.mjs': ['.mts', '.mjs'],
  };

  // Resolve workspace lib path aliases so webpack can bundle them
  config.resolve.alias = {
    ...config.resolve.alias,
    '@src': path.resolve(__dirname, 'src'),
    '@my-monorepo/database': path.resolve(__dirname, '../../libs/repository/src/index.ts'),
    '@my-monorepo/types': path.resolve(__dirname, '../../libs/types/src/index.ts'),
  };

  // Override externals: bundle workspace libs, externalize all real node_modules
  config.externals = [
    function ({ request }, callback) {
      // Bundle workspace libs and local path aliases (they resolve via alias above)
      if (request.startsWith('@my-monorepo/') || request.startsWith('@src/')) {
        return callback();
      }
      // Externalize everything else that looks like a package (not a relative/absolute path)
      if (!request.startsWith('.') && !request.startsWith('/') && !path.isAbsolute(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ];

  return config;
});
