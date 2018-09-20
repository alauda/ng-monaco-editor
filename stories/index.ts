import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';
import { CodeEditorModule } from '../src/public-api';

const exampleCode = `
apiVersion: v1
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
  .add('simple monaco editor', () => {
    const model = exampleCode;
    return {
      moduleMetadata: {
        imports: [
          CodeEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: `
      <h1>原始代码</h1>
      <textarea cols="80" rows="10" [(ngModel)]="model">{{ exampleCode }}</textarea>
      <h1>编辑器</h1>
      <ng-monaco-editor style="height: 300px" [options]="options" [(ngModel)]="model"></ng-monaco-editor>
      `,
      props: {
        options: {
          language: 'yaml',
          folding: true,
          minimap: { enabled: true },
        },
        model,
      },
    };
  })
  .add('colorize code', () => {
    return {
      moduleMetadata: {
        imports: [
          CodeEditorModule.forRoot({
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
