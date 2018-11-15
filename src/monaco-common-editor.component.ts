import {
  AfterViewInit,
  ChangeDetectorRef,
  DoCheck,
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
import { ResizeSensor } from 'css-element-queries';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import {
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';
import { MonacoProviderService } from './monaco-provider.service';
import { ResizeSensorService } from './resize-sensor.service';

const DEFAULT_RELAYOUT_INTERVAL = 100;

/**
 * Wraps powerful Monaco Editor for simpilicity use in Angular.
 */
export abstract class MonacoCommonEditorComponent
  implements
    OnInit,
    OnChanges,
    AfterViewInit,
    OnDestroy,
    DoCheck,
    ControlValueAccessor {
  protected model: import('monaco-editor').editor.IModel;
  protected _value = '';
  protected _prevOptions: MonacoEditorOptions;
  protected destroyed = false;
  protected editor: import('monaco-editor').editor.IStandaloneCodeEditor;
  private relayoutFunction: any;
  private resizeSensorInstance: ResizeSensor;
  private disposables: Array<import('monaco-editor').IDisposable> = [];

  monacoLoaded = false;

  @ViewChild('monacoContainer')
  protected monacoContainer: ElementRef;
  @ViewChild('monacoAnchor')
  protected monacoAnchor: ElementRef;

  /**
   * Raw Monaco editor options
   */
  @Input()
  options: import('monaco-editor').editor.IEditorConstructionOptions;

  /**
   * The URI which will be assigned to monaco-editor's model.
   * See monaco.Uri
   */
  @Input()
  modelUri: string;

  /**
   * Events emitted when monaco editor changed.
   */
  @Output()
  monacoEditorChanged = new EventEmitter();

  /**
   * Events emitted when monaco editor blurs.
   */
  @Output()
  blur = new EventEmitter();

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
  modelId: string;

  abstract createEditor(): import('monaco-editor').editor.IStandaloneCodeEditor;

  ngDoCheck(): void {
    // We should reset the editor when options change.
    if (this._prevOptions && !isEqual(this._prevOptions, this.options)) {
      this.initEditor();
    }
    this._prevOptions = this.options;
  }

  constructor(
    protected monacoEditorConfig: MonacoEditorConfig,
    protected monacoProvider: MonacoProviderService,
    protected cdr: ChangeDetectorRef,
    protected resizeSensor: ResizeSensorService,
  ) {}

  ngOnInit() {
    this.initEditor();
  }

  ngAfterViewInit(): void {
    const layoutInterval =
      this.monacoEditorConfig.autoLayoutInterval == null
        ? DEFAULT_RELAYOUT_INTERVAL
        : this.monacoEditorConfig.autoLayoutInterval;

    if (layoutInterval) {
      this.relayoutFunction = debounce(() => {
        if (this.editor) {
          this.editor.layout();
        }
      }, layoutInterval);
      this.resizeSensorInstance = this.resizeSensor.registerResize(
        this.monacoContainer.nativeElement,
        this.relayoutFunction,
      );
    }
  }

  ngOnChanges({ modelUri }: SimpleChanges): void {
    if (modelUri && !modelUri.isFirstChange()) {
      // If modelUri is changed, we need to recreate the editor to reflect the change.
      this.initEditor();
    }
  }

  ngOnDestroy(): void {
    this.dispose();

    if (this.resizeSensorInstance) {
      this.resizeSensorInstance.detach(this.relayoutFunction);
    }

    this.relayoutFunction = null;
    this.resizeSensorInstance = null;

    this.destroyed = true;
  }

  dispose() {
    if (this.editor) {
      this.editor.dispose();
    }
    if (this.model && !this.model.isDisposed()) {
      this.model.dispose();
    }
    this.disposables.forEach(disposable => disposable.dispose());
    this.editor = null;
    this.model = null;
    this.disposables = [];
  }

  // Following are APIs required by ControlValueAccessor
  onChange = (_: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this._value = value || '';
    // Fix for value change while dispose in process.
    if (this.editor) {
      this.updateEditorValue(this._value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  createModel(
    value: string,
    uri?: string,
  ): import('monaco-editor').editor.ITextModel {
    const { monaco } = this.monacoProvider;
    return monaco.editor.createModel(
      value,
      this.options.language,
      uri ? monaco.Uri.parse(uri) : undefined,
    );
  }

  private async initEditor() {
    await this.monacoProvider.initMonaco();
    this.monacoLoaded = true;

    this.dispose();

    if (!this.destroyed) {
      this.editor = this.createEditor();
      this.listenModelChanges();
      this.monacoEditorChanged.emit(this.editor);
      this.modelId = this.model.id;
      this.cdr.markForCheck();
    }
  }

  private listenModelChanges(): void {
    this.disposables = [];
    this.disposables.push(
      this.model.onDidChangeContent(() => {
        const value = this.model.getValue();
        if (this._value === value) {
          return;
        }
        this.onChange(value);
        this._value = value;
        this.cdr.markForCheck();
      }),
    );

    this.disposables.push(
      this.editor.onDidChangeModel(() => {
        this.cdr.markForCheck();
      }),
    );

    this.disposables.push(
      this.editor.onDidBlurEditorWidget(() => {
        this.onTouched();
        this.blur.emit();
      }),
    );
  }

  private updateEditorValue(value: string): void {
    this.model.setValue(value);
  }
}
