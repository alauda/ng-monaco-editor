import { Injectable } from '@angular/core';

import {
  MonacoEditor,
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';
import { Monaco } from './typing';

/**
 * Provider for monaco editor.
 */
@Injectable()
export class MonacoProviderService {
  constructor(private readonly monacoEditorConfig: MonacoEditorConfig) {}

  private _theme = this.themes[0];

  private _loadingPromise: Promise<Monaco>;

  async initMonaco() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return this._loadingPromise || (this._loadingPromise = this.loadMonaco());
  }

  private async loadMonaco(): Promise<Monaco> {
    if (this.monacoEditorConfig.dynamicImport) {
      return this.monacoEditorConfig.dynamicImport() as Promise<Monaco>;
    }
    if (this.monacoEditorConfig.baseUrl !== undefined) {
      await this.configRequireJs();
      return this.loadModule(['vs/editor/editor.main']);
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

  toggleTheme() {
    const otherTheme = this.themes.find(theme => theme !== this.theme);
    this.changeTheme(otherTheme);
  }

  /**
   * Expose global monaco object
   */
  get monaco() {
    return window.monaco;
  }

  /**
   * Expose global requirejs function/object
   */
  get require(): Require {
    return (window as any).require;
  }

  /**
   * Load additional monaco-editor modules.
   */
  loadModule(deps: string[]): Promise<Monaco> {
    return new Promise(resolve => this.require(deps, resolve));
  }

  changeTheme(theme: string) {
    if (!this.monaco) {
      return;
    }
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
    if (!this.monaco) {
      return;
    }
    return this.monaco.editor.create(
      domElement,
      this.getEditorOptions(options),
    );
  }

  createDiffEditor(
    domElement: HTMLElement,
    options?: monaco.editor.IDiffEditorConstructionOptions,
  ): monaco.editor.IStandaloneDiffEditor {
    if (!this.monaco) {
      return;
    }

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
    if (!this.monaco) {
      return;
    }

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
    if (!this.monaco) {
      return;
    }
    return this.monaco.languages
      .getLanguages()
      .find(
        language =>
          (language.aliases && language.aliases.includes(alias)) ||
          language.id === alias,
      );
  }

  /**
   * Currently monaco-editor is loaded via its only loader and it is RequireJs (amd) spec:
   */
  protected configRequireJs() {
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
}
