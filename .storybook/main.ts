import type { StorybookConfig } from '@storybook/angular';
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';
import { Configuration } from 'webpack';

const isDev = process.env.NODE_ENV === 'development';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: [`../node_modules/monaco-editor/${isDev ? 'dev' : 'min'}`],
  webpackFinal(config: Configuration) {
    config.module!.rules!.push({
      test: /node_modules[/\\]monaco-editor[/\\]esm[/\\].+\.css$/i,
      use: [
        'style-loader',
        'css-loader',
      ],
    });

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

export default config;
