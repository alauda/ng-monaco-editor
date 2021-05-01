import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type Monaco = typeof monaco;

declare global {
  interface Window {
    monaco: Monaco;
  }
}
