import { configure } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Alauda UI Storybook',
});

// automatically import all files ending in *.stories.ts
function loadStories() {
  require('../stories/index.ts');
}

configure(loadStories, module);
