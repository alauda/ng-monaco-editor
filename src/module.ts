import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CodeColorizeDirective } from './code-colorize.directive';
import { MonacoDiffEditorComponent } from './monaco-diff-editor.component';
import { MonacoEditorConfig } from './monaco-editor-config';
import { MonacoEditorComponent } from './monaco-editor.component';
import { MonacoProviderService } from './monaco-provider.service';
import { ResizeSensorService } from './resize-sensor.service';

const EXPORTABLES = [
  MonacoEditorComponent,
  MonacoDiffEditorComponent,
  CodeColorizeDirective,
];

export function MONACO_PROVIDER_FACTORY(
  parent: MonacoProviderService,
  monacoEditorConfig: MonacoEditorConfig,
) {
  return parent || new MonacoProviderService(monacoEditorConfig);
}

export const MONACO_PROVIDER = {
  // If there is already an CodeEditorIntl available, use that. Otherwise, provide a new one.
  provide: MonacoProviderService,
  deps: [
    [new Optional(), new SkipSelf(), MonacoProviderService],
    MonacoEditorConfig,
  ],
  useFactory: MONACO_PROVIDER_FACTORY,
};

export function RESIZE_SENSOR_PROVIDER_FACTORY(parent: ResizeSensorService) {
  return parent || new ResizeSensorService();
}

export const RESIZE_SENSOR_PROVIDER = {
  // If there is already an CodeEditorIntl available, use that. Otherwise, provide a new one.
  provide: ResizeSensorService,
  deps: [[new Optional(), new SkipSelf(), ResizeSensorService]],
  useFactory: RESIZE_SENSOR_PROVIDER_FACTORY,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...EXPORTABLES],
  exports: [...EXPORTABLES],
  providers: [MONACO_PROVIDER, RESIZE_SENSOR_PROVIDER],
})
export class MonacoEditorModule {
  static forRoot(
    config: MonacoEditorConfig = {},
  ): ModuleWithProviders<MonacoEditorModule> {
    return {
      ngModule: MonacoEditorModule,
      providers: [{ provide: MonacoEditorConfig, useValue: config }],
    };
  }
}
