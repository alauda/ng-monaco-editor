import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';
import { Configuration } from 'webpack';

export default {
  stories: ['../stories/**/*.stories.ts'],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-postcss',
  ],
  webpackFinal(config: Configuration) {
    config.plugins!.push(
      new MonacoEditorWebpackPlugin({
        languages: ['yaml'],
      }),
    );
    return config;
  },
};
