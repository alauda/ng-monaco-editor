import { NgModule } from '@angular/core';
import { Meta } from '@storybook/angular';

import { MonacoEditorModule } from '../src/public-api';

import { getStories } from './base';

@NgModule({
  imports: [
    MonacoEditorModule.forRoot({
      dynamicImport: () => import('monaco-editor'),
    }),
  ],
  exports: [MonacoEditorModule],
})
class EsmRootModule {}

const {
  meta: _meta,
  MonacoEditor,
  MonacoDiffEditor,
  ColorizeCode,
} = getStories(EsmRootModule);

const meta: Meta = {
  ..._meta,
  title: 'Code Editor - ESM',
};

export { ColorizeCode, MonacoDiffEditor, MonacoEditor };

export default meta;
