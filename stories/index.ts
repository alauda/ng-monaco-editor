import { storiesOf } from '@storybook/angular';
import { MonacoEditorModule } from '../src/public-api';

const exampleCode = `apiVersion: v1
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
  .add('monaco editor', () => {
    const model = exampleCode;
    return {
      moduleMetadata: {
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: `
      <h1>Raw</h1>
      <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
      <h1>ng-monaco-editor</h1>
      <ng-monaco-editor style="height: 300px" modelUri="file:text.yaml" [options]="options" [(ngModel)]="model"></ng-monaco-editor>
      `,
      props: {
        options: {
          folding: true,
          minimap: { enabled: true },
        },
        model,
      },
    };
  })
  .add('monaco diff editor', () => {
    const model = exampleCode;
    const originalModel = exampleCode;
    return {
      moduleMetadata: {
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: `
      <h1>Raw</h1>
      <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
      <h1>ng-monaco-diff-editor</h1>
      <ng-monaco-diff-editor style="height: 300px" modelUri="file:text.yaml" [originalValue]="originalModel"
       [options]="options" [(ngModel)]="model"></ng-monaco-diff-editor>
      `,
      props: {
        options: {
          folding: true,
          minimap: { enabled: true },
        },
        model,
        originalModel,
      },
    };
  })
  .add('colorize code', () => {
    return {
      moduleMetadata: {
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: `<pre style="font-family: Consolas, 'Courier New', monospace;"><code ngCodeColorize="yaml">{{ code }}</code></pre>`,
      props: {
        code: exampleCode,
      },
    };
  });
