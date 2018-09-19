/**
 * All common option fields for monaco are merged together for ease of config.
 */
export type MonacoEditorOptions = import('monaco-editor').editor.IEditorConstructionOptions &
  import('monaco-editor').editor.IDiffEditorConstructionOptions &
  import('monaco-editor').editor.IColorizerElementOptions;

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
   * Default options when creating editors
   */
  defaultOptions?: MonacoEditorOptions;

  /**
   * The interval for re-layout the editors. Default is 100 (ms).
   * If set to 0, then the editor will never do auto-relayout.
   */
  autoLayoutInterval?: number;
}
