import { Injectable } from '@angular/core';

import {
  MonacoEditorConfig,
  MonacoEditorOptions,
} from './monaco-editor-config';

let fetchingPromise: Promise<any> = null;

/**
 * Provider for monaco editor.
 */
@Injectable()
export class MonacoProviderService {
  constructor(private monacoEditorConfig: MonacoEditorConfig) {}

  private _theme: string = this.themes[0];

  async initMonaco(): Promise<any> {
    await this.configRequireJs();
    await this.loadModule(['vs/editor/editor.main']);

    return fetchingPromise;
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
  get monaco(): typeof import('monaco-editor') {
    return (window as any).monaco;
  }

  /**
   * Expose global requirejs function/object
   */
  get require(): any {
    return (window as any).require;
  }

  /**
   * Load additional monaco-editor modules.
   */
  loadModule(deps: string[]) {
    return new Promise(res => this.require(deps, res));
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
  create(
    domElement: HTMLElement,
    options?: import('monaco-editor').editor.IEditorConstructionOptions,
  ): import('monaco-editor').editor.IStandaloneCodeEditor {
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
    options?: import('monaco-editor').editor.IDiffEditorConstructionOptions,
  ): import('monaco-editor').editor.IStandaloneDiffEditor {
    if (!this.monaco) {
      return;
    }

    const diffOptions = {
      renderSideBySide: false,
      // You can optionally disable resizing by passing in the option.
      enableSplitViewResizing: false,
      ...(this.getEditorOptions(
        options,
      ) as import('monaco-editor').editor.IDiffEditorConstructionOptions),
    };

    return this.monaco.editor.createDiffEditor(domElement, diffOptions);
  }

  /**
   * Colorize an abitrary element:
   */
  colorizeElement(
    domElement: HTMLElement,
    options?: import('monaco-editor').editor.IColorizerElementOptions,
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
  ): import('monaco-editor').languages.ILanguageExtensionPoint {
    if (!this.monaco) {
      return;
    }
    return this.monaco.languages
      .getLanguages()
      .find(
        (language: any) =>
          (language.aliases && language.aliases.includes(alias)) ||
          language.id === alias,
      );
  }

  /**
   * Currently monaco-editor is loaded via its only loader and it is RequireJs (amd) spec:
   */
  protected configRequireJs() {
    if (!fetchingPromise) {
      fetchingPromise = new Promise((resolve, reject) => {
        if (this.monaco) {
          resolve();
        } else {
          const onAmdLoader = () => {
            this.require.config({
              baseUrl: this.monacoEditorConfig.baseUrl,
              paths: { vs: 'vs' },
            });
            resolve();
          };

          const onAmdLoaderError = (error: ErrorEvent) => {
            console.error('failed to load monaco', error);
            reject(error);
          };

          const loaderScript = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = [
            this.monacoEditorConfig.baseUrl,
            'vs/loader.js',
          ].join('/');
          loaderScript.addEventListener('load', () => onAmdLoader());
          loaderScript.addEventListener('error', error =>
            onAmdLoaderError(error),
          );
          document.body.appendChild(loaderScript);
        }
      });
    }
    return fetchingPromise;
  }
}
