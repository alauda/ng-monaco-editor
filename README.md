# Angular wrapper for monaco-editor

[![GitHub Release Workflow Status](https://github.com/alauda/ng-monaco-editor/workflows/Release/badge.svg)](https://github.com/alauda/ng-monaco-editor/actions/workflows/release.yml)
[![GitHub Stories Workflow Status](https://github.com/alauda/ng-monaco-editor/workflows/Deploy%20stories/badge.svg)](https://github.com/alauda/ng-monaco-editor/actions/workflows/stories.yml)
[![npm](https://img.shields.io/npm/v/ng-monaco-editor)](https://www.npmjs.com/package/ng-monaco-editor)

## Dependencies

- [`Angular`](https://github.com/angular/angular) 10+
- [`monaco-editor`](https://github.com/Microsoft/monaco-editor): 0.15+

## Demo

See: <https://ng-monaco-editor.js.org> or <https://ng-monaco-editor.netlify.app>

## Setup

### Add npm dependencies

```sh
# npm
npm i monaco-editor ng-monaco-editor

# yarn
yarn add monaco-editor ng-monaco-editor
```

### Configure monaco-editor library assets

It's supported to load monaco-editor with AMD or ESM mode.

If you'd like to use AMD mode, you have to make sure your Angular application could have access to the `monaco-editor` library
assets via AMD. If you are using Angular CLI to bootstrap your app, you could add the following:

```jsonc
{
  "assets": [
    "src/favicon.ico",
    "src/assets",

    {
      "glob": "**/*",
      "input": "node_modules/monaco-editor/min/vs",
      "output": "/lib/vs"
    }
  ]
}
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
      /**
       * optional, load monaco by yourself, you'd prefer loading esm for example
       */
      dynamicImport: () => import('monaco-editor'),

      /**
       * optional, use amd loader to load monaco if present, lower priority than `dynamicImport`
       *
       * Angular CLI currently does not handle assets with hashes. We manage it by manually adding
       * version numbers to force library updates:
       */
      baseUrl: 'lib/v1',

      defaultOptions: {},
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

Please refer to the storybook (`stories/**/*.stories.ts`).

This module provide three usages:

1. `ng-monaco-editor` component
2. `ng-monaco-diff-editor` component
3. `ngCodeColorize` directive

Note, if the height of ng-monaco-editor/ng-monaco-diff-editor is too small, you
may have to resize it yourself. This is a limitation and by design
that how monaco-editor works.

## License

[MIT](./LICENSE) @[Alauda](https://github.com/alauda)
