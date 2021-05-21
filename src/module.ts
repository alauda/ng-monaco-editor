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

const EXPORTABLES = [
  MonacoEditorComponent,
  MonacoDiffEditorComponent,
  CodeColorizeDirective,
];

export function MonacoProviderFactory(
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
  useFactory: MonacoProviderFactory,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: EXPORTABLES,
  exports: EXPORTABLES,
  providers: [MONACO_PROVIDER],
})
export class MonacoEditorModule {
  static forRoot(
    config: MonacoEditorConfig = {},
  ): ModuleWithProviders<MonacoEditorModule> {
    return {
      ngModule: MonacoEditorModule,
      providers: [
        {
          provide: MonacoEditorConfig,
          useValue: config,
        },
      ],
    };
  }
}
