export type Monaco = typeof import('monaco-editor');

declare global {
  interface Window {
    monaco?: Monaco;
  }
}
