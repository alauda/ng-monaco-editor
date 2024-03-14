import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { debounce, isEqual } from 'lodash-es';
import type { IDisposable, editor } from 'monaco-editor';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { observeResizeOn } from './helpers';
import {
  MonacoEditor,
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';
import { MonacoProviderService } from './monaco-provider.service';

const DEFAULT_RELAYOUT_INTERVAL = 100;

/**
 * Wraps powerful Monaco Editor for simplicity use in Angular.
 */
@Directive()
export abstract class MonacoCommonEditorComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor
{
  /**
   * Raw Monaco editor options
   */
  @Input()
  options!: MonacoEditorOptions;

  /**
   * The URI which will be assigned to monaco-editor's model.
   * See monaco.Uri
   */
  @Input()
  modelUri?: string;

  /**
   * Events emitted when monaco editor changed.
   */
  @Output()
  editorChange = new EventEmitter<MonacoEditor>();

  /**
   * Events emitted when monaco editor blurs.
   */
  @Output()
  editorBlur = new EventEmitter<void>();

  /**
   * A helper ID to let the user to see the embedded monaco editor ID.
   *
   * E.g., you could use the following to get the embedded value of the editor.
   *     monaco.editor
   *      .getModels()
   *      .find(
   *        model =>
   *          model.id ===
   *          document.querySelector('[model-id]').attributes[
   *            'model-id'
   *          ].value,
   *      )
   *      .getValue();
   */
  @HostBinding('attr.model-id')
  modelId!: string;

  @ViewChild('monacoContainer', { static: true })
  protected monacoContainer!: ElementRef;

  @ViewChild('monacoAnchor', { static: true })
  protected monacoAnchor!: ElementRef<HTMLElement>;

  private _rootEditor?: editor.IEditor | null;

  // for MonacoDiffEditorComponent usage
  protected get rootEditor() {
    return this._rootEditor ?? this.editor;
  }

  protected set rootEditor(editor) {
    this._rootEditor = editor;
  }

  protected editor?: MonacoEditor | null;
  protected model?: editor.IModel | null;

  private _monacoLoaded = false;

  // used in html
  get monacoLoaded() {
    return this._monacoLoaded;
  }

  private _destroyed = false;

  get destroyed() {
    return this._destroyed;
  }

  protected destroy$$ = new Subject<void>();

  protected get value() {
    return this._value;
  }

  private _value = '';
  private _prevOptions?: MonacoEditorOptions;
  private _disposables: IDisposable[] = [];

  abstract createEditor(): MonacoEditor;

  constructor(
    protected monacoEditorConfig: MonacoEditorConfig,
    protected monacoProvider: MonacoProviderService,
    protected cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.resetEditor();
  }

  ngAfterViewInit(): void {
    const layoutInterval =
      this.monacoEditorConfig.autoLayoutInterval ?? DEFAULT_RELAYOUT_INTERVAL;

    if (layoutInterval) {
      observeResizeOn(this.monacoContainer.nativeElement)
        .pipe(takeUntil(this.destroy$$))
        .subscribe(
          debounce(() => {
            if (this.editor) {
              this.editor.layout();
            }
          }, layoutInterval),
        );
    }
  }

  ngOnChanges({ modelUri, options }: SimpleChanges): void {
    if (modelUri && !modelUri.isFirstChange()) {
      // If modelUri is changed, we need to recreate the editor to reflect the change.
      this.resetEditor();
    }

    if (options) {
      const currOptions = options.currentValue as editor.IEditorOptions;
      // We should reset the editor when options change.
      if (this._prevOptions && !isEqual(this._prevOptions, currOptions)) {
        this.rootEditor!.updateOptions(currOptions);
      }
      this._prevOptions = currOptions;
    }
  }

  ngOnDestroy(): void {
    this.dispose();

    this._destroyed = true;
  }

  dispose() {
    this.rootEditor?.dispose();
    if (this.model && !this.model.isDisposed()) {
      this.model.dispose();
    }
    this._disposables.forEach(disposable => disposable.dispose());
    this.rootEditor = this.editor = null;
    this.model = null;
    this._disposables = [];
  }

  // Following are APIs required by ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(value: string): void {
    this._value = value || '';
    // Fix for value change while dispose in process.
    if (this.editor) {
      this.model!.setValue(this._value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  createModel(value: string, uri?: string): editor.ITextModel {
    const { monaco } = this.monacoProvider;
    const modelUri = uri ? monaco.Uri.parse(uri) : undefined;
    const model = modelUri && monaco.editor.getModel(modelUri);
    model?.dispose();
    return monaco.editor.createModel(value, this.options.language, modelUri);
  }

  private async resetEditor() {
    if (this.monacoLoaded) {
      this.dispose();
    } else {
      await this.monacoProvider.initMonaco();
      this._monacoLoaded = true;
    }

    if (!this.destroyed) {
      this.editor = this.createEditor();
      this.listenModelChanges();
      this.editorChange.emit(this.editor);
      this.modelId = this.model!.id;
      this.cdr.markForCheck();
    }
  }

  private listenModelChanges(): void {
    const editor = this.editor!;
    const model = this.model!;
    this._disposables = [
      model.onDidChangeContent(() => {
        const value = model.getValue();
        if (this._value === value) {
          return;
        }
        this.onChange(value);
        this._value = value;
        this.cdr.markForCheck();
      }),
      editor.onDidChangeModel(() => {
        this.cdr.markForCheck();
      }),
      editor.onDidBlurEditorWidget(() => {
        this.onTouched();
        this.editorBlur.emit();
      }),
    ];
  }
}
