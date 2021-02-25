import { NgModule } from '@angular/core';

import { MonacoEditorModule } from '../src/public-api';

import { startStories } from './base';

@NgModule({
  imports: [
    MonacoEditorModule.forRoot({
      dynamicImport: () => import('monaco-editor/esm/vs/editor/editor.api'),
    }),
  ],
  exports: [MonacoEditorModule],
})
export class EsmRootModule {}

startStories(EsmRootModule);
