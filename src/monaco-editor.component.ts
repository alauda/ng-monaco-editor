import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MonacoCommonEditorComponent } from './monaco-common-editor.component';
import { MonacoEditorConfig } from './monaco-editor-config';
import { MonacoProviderService } from './monaco-provider.service';
import { ResizeSensorService } from './resize-sensor.service';

/**
 * Wraps Monaco Editor for simplicity use in Angular.
 */
@Component({
  selector: 'ng-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoEditorComponent extends MonacoCommonEditorComponent {
  constructor(
    monacoEditorConfig: MonacoEditorConfig,
    monacoProvider: MonacoProviderService,
    cdr: ChangeDetectorRef,
    resizeSensor: ResizeSensorService,
  ) {
    super(monacoEditorConfig, monacoProvider, cdr, resizeSensor);
  }

  createEditor(): import('monaco-editor').editor.IStandaloneCodeEditor {
    this.model = this.createModel(this._value, this.modelUri);
    return this.monacoProvider.create(this.monacoAnchor.nativeElement, {
      ...this.options,
      model: this.model,
    });
  }
}
