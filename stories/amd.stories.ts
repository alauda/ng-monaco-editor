import { NgModule } from '@angular/core';

import { MonacoEditorModule } from '../src/public-api';

import { startStories } from './base';

@NgModule({
  imports: [
    MonacoEditorModule.forRoot({
      baseUrl: '',
    }),
  ],
  exports: [MonacoEditorModule],
})
export class AmdRootModule {}

startStories(AmdRootModule);
