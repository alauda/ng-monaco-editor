import { Injectable } from '@angular/core';
import type { editor } from 'monaco-editor';

import { Monaco } from './typings';

/**
 * All common option fields for monaco are merged together for ease of config.
 */
export type MonacoEditorOptions = editor.IStandaloneEditorConstructionOptions;

export type MonacoEditor = editor.IStandaloneCodeEditor;

/**
 * Configuration over monaco editor.
 */
@Injectable({ providedIn: 'root' })
export class MonacoEditorConfig {
  /**
   * The base URL to monaco editor library assets via AMD (RequireJS).
   *
   * e.g., assets/monaco-editor/min
   */
  baseUrl?: string;

  /**
   * Use webpack dynamic import function to load monaco assets.
   *
   * e.g., () => import('monaco-editor')
   */
  dynamicImport?: () => Promise<Monaco>;

  /**
   * Default options when creating editors
   */
  defaultOptions?: MonacoEditorOptions;

  /**
   * The interval for re-layout the editors. Default is 100 (ms).
   * If set to 0, then the editor will never do auto-relayout.
   */
  autoLayoutInterval?: number;
}
