import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

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

export const startStories = (RootModule: Type<any>) => {
  const suffix = ' - ' + RootModule.name;

  storiesOf('Code Editor' + suffix, module)
    .addDecorator(withKnobs)
    .add('monaco editor' + suffix, () => {
      const model = exampleCode;
      const options = object('options', {
        folding: true,
        minimap: { enabled: false },
        readOnly: false,
        language: 'yaml',
      });
      return {
        moduleMetadata: {
          imports: [CommonModule, FormsModule, RootModule],
        },
        template: /* HTML */ `
          <h1>Raw</h1>
          <textarea
            cols="80"
            rows="10"
            [(ngModel)]="model"
          ></textarea>
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
    .add('monaco diff editor' + suffix, () => {
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
          imports: [CommonModule, FormsModule, RootModule],
        },
        template: /* HTML */ `
          <h1>Raw</h1>
          <textarea
            cols="80"
            rows="10"
            [(ngModel)]="model"
          ></textarea>
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
    .add('colorize code' + suffix, () => ({
      moduleMetadata: {
        imports: [CommonModule, FormsModule, RootModule],
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
};
