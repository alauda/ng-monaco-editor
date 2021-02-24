import { NgModule } from '@angular/core';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { MonacoEditorModule } from '../src/public-api';

@NgModule({
  imports: [
    MonacoEditorModule.forRoot({
      baseUrl: '',
      defaultOptions: {},
    }),
  ],
  exports: [MonacoEditorModule],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RootModule {}

const exampleCode = /* YAML */ `apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: wp
    image: wordpress
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
`;

storiesOf('Code Editor', module)
  .addDecorator(withKnobs)
  .add('monaco editor', () => {
    const model = exampleCode;
    const options = object('options', {
      folding: true,
      minimap: { enabled: false },
      readOnly: false,
      language: 'yaml',
    });
    return {
      moduleMetadata: {
        imports: [RootModule],
      },
      template: /* HTML */ `
        <h1>Raw</h1>
        <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
        <h1>ng-monaco-editor</h1>
        <ng-monaco-editor
          style="height: 300px"
          modelUri="file:text.yaml"
          [options]="options"
          [(ngModel)]="model"
        ></ng-monaco-editor>
      `,
      props: {
        options,
        model,
      },
    };
  })
  .add('monaco diff editor', () => {
    const model = exampleCode;
    const originalModel = exampleCode;
    const modelUri = text('modelUri', 'file:text.yaml');
    const options = object('options', {
      folding: true,
      minimap: { enabled: false },
      readOnly: false,
    });
    return {
      moduleMetadata: {
        imports: [RootModule],
      },
      template: /* HTML */ `
        <h1>Raw</h1>
        <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
        <h1>ng-monaco-diff-editor</h1>
        <ng-monaco-diff-editor
          style="height: 300px"
          [modelUri]="modelUri"
          [originalValue]="originalModel"
          [options]="options"
          [(ngModel)]="model"
        ></ng-monaco-diff-editor>
      `,
      props: {
        options,
        model,
        originalModel,
        modelUri,
      },
    };
  })
  .add('colorize code', () => ({
    moduleMetadata: {
      imports: [RootModule],
    },
    template: /* HTML */ `
      <pre
        style="font-family: Consolas, 'Courier New', monospace;"
      ><code ngCodeColorize="yaml">{{ code }}</code></pre>
    `,
    props: {
      code: text('code', exampleCode),
    },
  }));
