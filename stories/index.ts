import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { MonacoEditorModule } from '../src/public-api';

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

const jenkinsfileCode = `pipeline{
    agent {label "golang"}
    options{
      buildDiscarder(logRotator(numToKeepStr: '200'))
    }

    stages{
      stage("clone"){
        steps{
          script{
            env.TEST = "test"

            def scmVars = checkout([
              $class: 'GitSCM',
              branches: [[name: "feat/test"]],
            ])
          }
        }
      }
    }
  }
`;

storiesOf('Code Editor', module)
  .addDecorator(withKnobs)
  .add('monaco editor for Groovy', () => {
    const model = jenkinsfileCode;
    const options = object('options', {
      folding: true,
      minimap: { enabled: false },
      readOnly: false,
      language: 'groovy',
    });
    return {
      moduleMetadata: {
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: /* HTML */ `
        <h1>Raw</h1>
        <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
        <h1>ng-monaco-editor-for-Groovy</h1>
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
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
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
    const options = object('options', {
      folding: true,
      minimap: { enabled: false },
      readOnly: false,
    });
    return {
      moduleMetadata: {
        imports: [
          MonacoEditorModule.forRoot({
            baseUrl: '',
            defaultOptions: {},
          }),
        ],
      },
      template: /* HTML */ `
        <h1>Raw</h1>
        <button (click)="toggleOptions()">Toggle Options</button>
        <textarea cols="80" rows="10" [(ngModel)]="model"></textarea>
        <h1>ng-monaco-diff-editor</h1>
        <ng-monaco-diff-editor
          style="height: 300px"
          modelUri="file:text.yaml"
          [originalValue]="originalModel"
          [options]="options"
          [(ngModel)]="model"
        ></ng-monaco-diff-editor>
      `,
      props: {
        options,
        model,
        originalModel,
        toggleOptions() {
          this.options = { ...this.options, whatever: !this.options.whatever };
        },
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
      template: /* HTML */ `
        <pre
          style="font-family: Consolas, 'Courier New', monospace;"
        ><code ngCodeColorize="yaml">{{ code }}</code></pre>
      `,
      props: {
        code: exampleCode,
      },
    };
  });
