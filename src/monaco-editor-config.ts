import { Monaco } from './typing';

/**
 * All common option fields for monaco are merged together for ease of config.
 */
export type MonacoEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions;

export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

/**
 * Configuration over monaco editor.
 */
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
   * e.g., () => import('monaco-editor/esm/vs/editor/editor.api')
   */
  dynamicImport?: () => Promise<typeof import('monaco-editor')>;

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
