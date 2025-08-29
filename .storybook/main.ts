import type { StorybookConfig } from '@storybook/nextjs';

const isLight = process.env.STORYBOOK_LIGHT === 'true' || process.env.STORYBOOK_CI === 'true'
const withDocs = process.env.STORYBOOK_DOCS !== 'false' && !isLight

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    // Docs can be toggled via STORYBOOK_DOCS=false; disabled in light/CI by default
    ...(withDocs ? ["@storybook/addon-docs"] : []),
    "@storybook/addon-a11y",
    // Optional/weighty addons disabled in light/CI
    ...(isLight ? [] : ["@storybook/addon-onboarding", "@storybook/addon-vitest"])
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "webpackFinal": async (config) => {
    // Fix for chunk loading issues and webpack-bundle-analyzer
    if (config.optimization) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          default: {
            enforce: true,
            priority: 1,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            priority: 10,
          },
        },
      };
    }
    
    // Remove problematic webpack-bundle-analyzer plugin if present
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        return plugin.constructor.name !== 'BundleAnalyzerPlugin';
      });
    }
    
    // Optional: generate analyzer report for Storybook
    if (process.env.STORYBOOK_ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins = config.plugins || []
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'sb-bundle-report.html',
        generateStatsFile: true,
        statsFilename: 'sb-stats.json'
      }))
    }

    return config;
  }
};
export default config;
