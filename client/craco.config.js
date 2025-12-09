const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1890ff',
              '@border-radius-base': '8px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Set output path to server build directory
      webpackConfig.output.path = path.join(__dirname, '..', 'server', 'build');

      if (env === 'production') {
        // Find babel-loader rule and remove react-refresh plugin
        const babelRule = webpackConfig.module.rules.find(rule =>
          rule.oneOf && rule.oneOf.some(oneOfRule =>
            oneOfRule.use && oneOfRule.use.loader && oneOfRule.use.loader.includes('babel-loader')
          )
        );

        if (babelRule && babelRule.oneOf) {
          babelRule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.use && oneOfRule.use.loader && oneOfRule.use.loader.includes('babel-loader')) {
              if (oneOfRule.use.options && oneOfRule.use.options.plugins) {
                oneOfRule.use.options.plugins = oneOfRule.use.options.plugins.filter(plugin => {
                  if (Array.isArray(plugin)) {
                    return !plugin[0].includes('react-refresh');
                  }
                  return !plugin.includes('react-refresh');
                });
              }
            }
          });
        }
      }
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [],
    },
  },
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Find babel-loader rule and remove react-refresh plugin
        const babelRule = webpackConfig.module.rules.find(rule =>
          rule.oneOf && rule.oneOf.some(oneOfRule =>
            oneOfRule.use && oneOfRule.use.loader && oneOfRule.use.loader.includes('babel-loader')
          )
        );

        if (babelRule && babelRule.oneOf) {
          babelRule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.use && oneOfRule.use.loader && oneOfRule.use.loader.includes('babel-loader')) {
              if (oneOfRule.use.options && oneOfRule.use.options.plugins) {
                oneOfRule.use.options.plugins = oneOfRule.use.options.plugins.filter(plugin => {
                  if (Array.isArray(plugin)) {
                    return !plugin[0].includes('react-refresh');
                  }
                  return !plugin.includes('react-refresh');
                });
              }
            }
          });
        }
      }
      return webpackConfig;
    },
  },
};