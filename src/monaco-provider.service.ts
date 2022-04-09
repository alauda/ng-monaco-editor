import { Injectable } from '@angular/core';
import type { editor } from 'monaco-editor';
import { BehaviorSubject } from 'rxjs';

import {
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';
import { Monaco } from './typings';

export interface Require {
  <T>(deps: string[], callback: (result: T) => void): void;
  config(options: {
    baseUrl: string;
    paths: {
      [key: string]: string;
    };
  }): void;
}

/**
 * Provider for monaco editor.
 */
@Injectable()
export class MonacoProviderService {
  private _theme =
    this.monacoEditorConfig.defaultOptions?.theme ?? this.themes[0];

  private _monaco?: Monaco;
  private _loadingPromise?: Promise<Monaco>;

  private readonly theme$$ = new BehaviorSubject<string>(this.theme);

  theme$ = this.theme$$.asObservable();

  /**
   * Returns all available themes
   */
  get themes() {
    return ['vs', 'vs-dark'];
  }

  /**
   * Return the current theme
   */
  get theme() {
    return this._theme;
  }

  /**
   * Expose global monaco object
   */
  get monaco() {
    return (this._monaco || window.monaco)!;
  }

  /**
   * Expose global amd require function/object
   */
  get require(): Require | undefined {
    return window.require as unknown as Require;
  }

  constructor(private readonly monacoEditorConfig: MonacoEditorConfig) {}

  async initMonaco() {
    return this._loadingPromise || (this._loadingPromise = this.loadMonaco());
  }

  /**
   * Load additional monaco-editor modules.
   */
  loadModule<T>(deps: string[]) {
    return new Promise<T>(resolve => this.require!(deps, resolve));
  }

  toggleTheme() {
    this.changeTheme(this.themes.find(theme => theme !== this.theme)!);
  }

  changeTheme(theme: string) {
    this.assertMonaco();

    this._theme = theme;
    this.monaco.editor.setTheme(theme);
    this.theme$$.next(this.theme);
  }

  getEditorOptions(options?: MonacoEditorOptions): MonacoEditorOptions {
    return {
      ...this.monacoEditorConfig.defaultOptions,
      theme: this.theme,
      ...options,
    };
  }

  /**
   * Create a code-editor at the given dom element.
   */
  create(domElement: HTMLElement, options?: MonacoEditorOptions) {
    this.assertMonaco();

    return this.monaco.editor.create(
      domElement,
      this.getEditorOptions(options),
    );
  }

  createDiffEditor(
    domElement: HTMLElement,
    options?: editor.IDiffEditorConstructionOptions,
  ) {
    this.assertMonaco();

    return this.monaco.editor.createDiffEditor(domElement, {
      renderSideBySide: false,
      // You can optionally disable resizing by passing in the option.
      enableSplitViewResizing: false,
      ...this.getEditorOptions(options),
    });
  }

  /**
   * Colorize an arbitrary element:
   */
  colorizeElement(
    domElement: HTMLElement,
    options?: editor.IColorizerElementOptions,
  ) {
    this.assertMonaco();

    return this.monaco.editor.colorizeElement(domElement, {
      theme: this.theme,
      ...options,
    });
  }

  /**
   * Let the monaco-editor returns language information for the given alias.
   */
  getLanguageExtensionPoint(alias: string) {
    this.assertMonaco();

    return this.monaco.languages
      .getLanguages()
      .find(({ aliases, id }) => aliases?.includes(alias) || id === alias);
  }

  /**
   * Currently monaco-editor is loaded via its own loader and it is RequireJs (amd) spec:
   */
  protected configAmdLoader(baseUrl: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.monaco && this.require) {
        return resolve();
      }

      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = [this.monacoEditorConfig.baseUrl, 'vs/loader.js']
        .filter(_ => !!_)
        .join('/');
      loaderScript.addEventListener('load', () => {
        this.require!.config({
          baseUrl,
          paths: { vs: 'vs' },
        });
        resolve();
      });
      loaderScript.addEventListener('error', reject);
      document.body.append(loaderScript);
    });
  }

  private assertMonaco() {
    if (!this.monaco) {
      throw new Error(
        '`monaco` has not been initialized, please call `initMonaco()` first',
      );
    }
  }

  private async loadMonaco() {
    if (this.monacoEditorConfig.dynamicImport) {
      return this.monacoEditorConfig
        .dynamicImport()
        .then(monaco => (this._monaco = monaco));
    }

    if (this.monacoEditorConfig.baseUrl != null) {
      await this.configAmdLoader(this.monacoEditorConfig.baseUrl);
      return this.loadModule<Monaco>(['vs/editor/editor.main']).then(
        monaco => (this._monaco = monaco),
      );
    }

    if (!window.monaco) {
      throw new Error('No `monaco` found on `window`');
    }

    return window.monaco;
  }
}
