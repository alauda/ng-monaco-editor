import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';
import { Configuration } from 'webpack';

const isDev = process.env.NODE_ENV === 'development';

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
  staticDirs: [`../node_modules/monaco-editor/${isDev ?'dev':'min'}`],
  webpackFinal(config: Configuration) {
    config.plugins!.push(
      new MonacoEditorWebpackPlugin({
        languages: ['yaml'],
        globalAPI: true,
        customLanguages: [
          {
            label: 'yaml',
            entry: '../../monaco-yaml/index.js',
            worker: {
              id: 'vs/language/yaml/yamlWorker',
              entry: '../../monaco-yaml/yaml.worker.js',
            },
          },
        ],
      }),
    );
    return config;
  },
};
