import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
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

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...EXPORTABLES],
  exports: [...EXPORTABLES],
})
export class MonacoEditorModule {
  public static forRoot(config: MonacoEditorConfig = {}): ModuleWithProviders {
    return {
      ngModule: MonacoEditorModule,
      providers: [
        { provide: MonacoEditorConfig, useValue: config },
        MonacoProviderService,
        ResizeSensorService,
      ],
    };
  }
}
