import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MonacoCommonEditorComponent } from './monaco-common-editor.component';
import { MonacoEditor, MonacoEditorConfig } from './monaco-editor-config';
import { MonacoProviderService } from './monaco-provider.service';
import { ResizeSensorService } from './resize-sensor.service';

/**
 * Wraps powerful Monaco Editor for simplicity usage in Angular.
 */
@Component({
  selector: 'ng-monaco-diff-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoDiffEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoDiffEditorComponent extends MonacoCommonEditorComponent
  implements OnChanges, OnDestroy {
  protected originalModel: import('monaco-editor').editor.ITextModel;

  @Input()
  originalValue: string;

  constructor(
    monacoEditorConfig: MonacoEditorConfig,
    monacoProvider: MonacoProviderService,
    cdr: ChangeDetectorRef,
    resizeSensor: ResizeSensorService,
  ) {
    super(monacoEditorConfig, monacoProvider, cdr, resizeSensor);
  }

  createEditor(): MonacoEditor {
    this.originalModel = this.createModel(this.originalValue);
    this.model = this.createModel(this._value, this.modelUri);

    const editor = this.monacoProvider.createDiffEditor(
      this.monacoAnchor.nativeElement,
      this.options,
    );

    editor.setModel({
      original: this.originalModel,
      modified: this.model,
    });

    return editor.getModifiedEditor();
  }

  ngOnChanges({ originalValue }: SimpleChanges): void {
    super.ngOnChanges({ originalValue });
    if (originalValue && this.originalModel) {
      this.originalModel.setValue(this.originalValue);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.originalModel) {
      this.originalModel.dispose();
    }
  }
}
