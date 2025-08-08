import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
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
    
    return config;
  }
};
export default config;