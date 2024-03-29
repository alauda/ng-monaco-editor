import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { editor } from 'monaco-editor';

import { MonacoCommonEditorComponent } from './monaco-common-editor.component';
import { MonacoEditor } from './monaco-editor-config';

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
export class MonacoDiffEditorComponent
  extends MonacoCommonEditorComponent
  implements OnChanges, OnDestroy
{
  @Input()
  originalValue!: string;

  protected originalModel!: editor.ITextModel;

  createEditor(): MonacoEditor {
    this.originalModel = this.createModel(this.originalValue);
    this.model = this.createModel(this.value, this.modelUri);

    const editor = this.monacoProvider.createDiffEditor(
      this.monacoAnchor.nativeElement,
      this.options,
    );

    this.rootEditor = editor;

    editor.setModel({
      original: this.originalModel,
      modified: this.model,
    });

    return editor.getModifiedEditor();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.originalValue) {
      this.originalModel?.setValue(
        changes.originalValue.currentValue as string,
      );
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.originalModel?.dispose();
  }
}
