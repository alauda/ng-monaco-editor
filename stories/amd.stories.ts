import { NgModule } from '@angular/core';
import { Meta } from '@storybook/angular';

import { MonacoEditorModule } from '../src/public-api';

import { getStories } from './base';

@NgModule({
  imports: [
    MonacoEditorModule.forRoot({
      baseUrl: '',
    }),
  ],
  exports: [MonacoEditorModule],
})
class AmdRootModule {}

const {
  meta: _meta,
  MonacoEditor,
  MonacoDiffEditor,
  ColorizeCode,
} = getStories(AmdRootModule);

const meta: Meta = {
  ..._meta,
  title: 'Code Editor - AMD',
};

export { ColorizeCode, MonacoDiffEditor, MonacoEditor };

export default meta;
