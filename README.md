# Angular wrapper for monaco-editor

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/alauda/ng-monaco-editor/Publish%20package)](https://github.com/alauda/ng-monaco-editor/actions?query=workflow%3A%22Publish+package%22)
[![npm](https://img.shields.io/npm/v/ng-monaco-editor)](https://www.npmjs.com/package/ng-monaco-editor)

## Dependencies

- Angular 7+
- monaco-editor: 1.5+

## Demo

See: <https://alauda.github.io/ng-monaco-editor/>

## Setup

### Add npm dependencies

```
yarn add monaco-editor ng-monaco-editor
```

### Configure monaco-editor library assets

Currently this library only supports load monaco-editor with AMD mode. You have
to make sure your Angular application could have access to the monaco-editor library
assets via RequireJS.

If you are using Angular CLI to bootstrap your app, you could add the following:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",

  {
    "glob": "**/*",
    "input": "node_modules/monaco-editor/min/vs",
    "output": "/lib/vs"
  },
],
```

### Load ng-monaco-editor module

Most of the time, you should configure the module at the root module.

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot({
      // Angular CLI currently does not handle assets with hashes. We manage it by manually adding
      // version numbers to force library updates:
      baseUrl: 'lib',
      defaultOptions: DEFAULT_MONACO_OPTIONS,
    }),
  ],
  providers: [
    {
      // Optional:
      // You could also override the default MonacoEditor provider.
      // If you plan to do so, I recommend you to read through the source code.
      provide: MonacoProviderService,
      useClass: CustomMonacoProviderService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Usage example

Please refer to the storybook (`stores/index.ts`).
This module provide three usages:

1. `ng-monaco-editor` component
2. `ng-monaco-diff-editor` component
3. `ngCodeColorize` directive

Note, if the height of ng-monaco-editor/ng-monaco-diff-editor is too small, you
may have to resize it yourself. This is a limitation and by design
that how monaco-editor works.

# License

MIT @[Alauda](https://github.com/alauda)
