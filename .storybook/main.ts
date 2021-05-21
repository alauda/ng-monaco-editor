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
};
