import { CommonModule } from '@angular/common';
import { Type, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

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

export const getStories = (RootModule: Type<any>) => {
  const meta: Meta = {
    decorators: [
      applicationConfig({
        providers: [importProvidersFrom([RootModule])],
      }),
      moduleMetadata({
        imports: [CommonModule, FormsModule, RootModule],
      }),
    ],
  };

  const MonacoEditor: StoryObj = {
    args: {
      model: exampleCode,
      options: {
        folding: true,
        minimap: { enabled: false },
        readOnly: false,
        language: 'yaml',
      },
    },
    render: args => ({
      props: args,
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
    }),
  };

  const MonacoDiffEditor: StoryObj = {
    args: {
      model: exampleCode,
      originalModel: exampleCode,
      options: {
        folding: true,
        minimap: { enabled: false },
        readOnly: false,
      },
    },
    render: args => ({
      props: args,
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
          modelUri="file:text.yaml"
          [originalValue]="originalModel"
          [options]="options"
          [(ngModel)]="model"
        ></ng-monaco-diff-editor>
      `,
    }),
  };

  const ColorizeCode: StoryObj = {
    args: {
      code: exampleCode,
    },
    render: args => ({
      props: args,
      template: /* HTML */ `
        <pre
          style="font-family: Consolas, 'Courier New', monospace;"
        ><code ngCodeColorize="yaml">{{ code }}</code></pre>
      `,
    }),
  };

  return {
    meta,
    MonacoEditor,
    MonacoDiffEditor,
    ColorizeCode,
  };
};
