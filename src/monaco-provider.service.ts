import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  MonacoEditor,
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';
import { Monaco } from './typing';

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
  constructor(private readonly monacoEditorConfig: MonacoEditorConfig) {}
  private _theme = this.themes[0];

  private _monaco: Monaco;

  private _loadingPromise: Promise<Monaco>;

  isDarkTheme$$ = new BehaviorSubject<boolean>(this.isDarkTheme);

  async initMonaco() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return this._loadingPromise || (this._loadingPromise = this.loadMonaco());
  }

  private async loadMonaco(): Promise<Monaco> {
    if (this.monacoEditorConfig.dynamicImport) {
      return this.monacoEditorConfig
        .dynamicImport()
        .then(monaco => (this._monaco = monaco as Monaco));
    }

    if (this.monacoEditorConfig.baseUrl != null) {
      await this.configAmdLoader();
      return this.loadModule<Monaco>(['vs/editor/editor.main']).then(
        monaco => (this._monaco = monaco),
      );
    }

    return Promise.resolve(window.monaco);
  }

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

  get isDarkTheme() {
    return this._theme && this._theme.endsWith('-dark');
  }

  /**
   * Expose global monaco object
   */
  get monaco() {
    return this._monaco || window.monaco;
  }

  /**
   * Expose global amd require function/object
   */
  get require() {
    return (window.require as unknown) as Require;
  }

  /**
   * Load additional monaco-editor modules.
   */
  loadModule<T>(deps: string[]): Promise<T> {
    return new Promise(resolve => this.require(deps, resolve));
  }

  toggleTheme() {
    this.changeTheme(this.themes.find(theme => theme !== this.theme));
  }

  changeTheme(theme: string) {
    this.assertMonaco();

    this._theme = theme;
    this.monaco.editor.setTheme(theme);
  }

  getEditorOptions(options: MonacoEditorOptions): MonacoEditorOptions {
    return {
      ...this.monacoEditorConfig.defaultOptions,
      theme: this.theme,
      ...options,
    };
  }

  /**
   * Create a code-editor at the given dom element.
   */
  create(domElement: HTMLElement, options?: MonacoEditorOptions): MonacoEditor {
    this.assertMonaco();

    return this.monaco.editor.create(
      domElement,
      this.getEditorOptions(options),
    );
  }

  createDiffEditor(
    domElement: HTMLElement,
    options?: monaco.editor.IDiffEditorConstructionOptions,
  ): monaco.editor.IStandaloneDiffEditor {
    this.assertMonaco();

    const diffOptions = {
      renderSideBySide: false,
      // You can optionally disable resizing by passing in the option.
      enableSplitViewResizing: false,
      ...this.getEditorOptions(options),
    };

    return this.monaco.editor.createDiffEditor(domElement, diffOptions);
  }

  /**
   * Colorize an arbitrary element:
   */
  colorizeElement(
    domElement: HTMLElement,
    options?: monaco.editor.IColorizerElementOptions,
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
  getLanguageExtensionPoint(
    alias: string,
  ): monaco.languages.ILanguageExtensionPoint {
    this.assertMonaco();

    return this.monaco.languages
      .getLanguages()
      .find(
        language =>
          (language.aliases && language.aliases.includes(alias)) ||
          language.id === alias,
      );
  }

  /**
   * Currently monaco-editor is loaded via its own loader and it is RequireJs (amd) spec:
   */
  protected configAmdLoader() {
    return new Promise<void>((resolve, reject) => {
      if (this.monaco) {
        return resolve();
      }

      const onAmdLoader = () => {
        this.require.config({
          baseUrl: this.monacoEditorConfig.baseUrl,
          paths: { vs: 'vs' },
        });
        resolve();
      };

      const onAmdLoaderError = (error: ErrorEvent) => reject(error);

      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = [this.monacoEditorConfig.baseUrl, 'vs/loader.js']
        .filter(p => !!p)
        .join('/');
      loaderScript.addEventListener('load', onAmdLoader);
      loaderScript.addEventListener('error', onAmdLoaderError);
      document.body.append(loaderScript);
    });
  }

  private assertMonaco() {
    if (!this.monaco) {
      throw new Error(
        'monaco has not been initialized, please call `initMonaco()` first',
      );
    }
  }
}
