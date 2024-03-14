# Changelog

## 5.1.1

### Patch Changes

- [#96](https://github.com/alauda/ng-monaco-editor/pull/96) [`a2d430e`](https://github.com/alauda/ng-monaco-editor/commit/a2d430eb38039182ce010cd07f86eca38d39f7d7) Thanks [@yangxiaolang](https://github.com/yangxiaolang)! - fix: exit fullscreen model dup error

## 5.1.0

### Minor Changes

- [#91](https://github.com/alauda/ng-monaco-editor/pull/91) [`e2232ad`](https://github.com/alauda/ng-monaco-editor/commit/e2232ad797394ddd84e6c4c54ba037b7f094c3fa) Thanks [@JounQin](https://github.com/JounQin)! - chore: bump dependencies

## 5.0.3

### Patch Changes

- [`77ca594`](https://github.com/alauda/ng-monaco-editor/commit/77ca59493a261177dd1681749ac6518aedf609ae) Thanks [@JounQin](https://github.com/JounQin)! - fix: model-id is not language id

## 5.0.2

### Patch Changes

- [#79](https://github.com/alauda/ng-monaco-editor/pull/79) [`127fb20`](https://github.com/alauda/ng-monaco-editor/commit/127fb20848a53f82a5c8952a16b7ac351f11c544) Thanks [@JounQin](https://github.com/JounQin)! - chore: compatibility with older monaco

## 5.0.1

### Patch Changes

- [#76](https://github.com/alauda/ng-monaco-editor/pull/76) [`22f039a`](https://github.com/alauda/ng-monaco-editor/commit/22f039a628e37c90654f88a8caa18b55c14fa2fd) Thanks [@JounQin](https://github.com/JounQin)! - fix: use getLanguageId instead of model.id

## 5.0.0

### Major Changes

- [#73](https://github.com/alauda/ng-monaco-editor/pull/73) [`bcf921b`](https://github.com/alauda/ng-monaco-editor/commit/bcf921ba97e1e3a599cf96d79157148a960165c3) Thanks [@JounQin](https://github.com/JounQin)! - feat!: expose theme as Observable, remove isDarkTheme

### Patch Changes

- [#75](https://github.com/alauda/ng-monaco-editor/pull/75) [`bddf557`](https://github.com/alauda/ng-monaco-editor/commit/bddf557d39163a31956f8325724379c1fc1d3933) Thanks [@JounQin](https://github.com/JounQin)! - chore: provide service and config in root

- [#73](https://github.com/alauda/ng-monaco-editor/pull/73) [`bcf921b`](https://github.com/alauda/ng-monaco-editor/commit/bcf921ba97e1e3a599cf96d79157148a960165c3) Thanks [@JounQin](https://github.com/JounQin)! - fix: use `defaultOptions.theme` as default theme

## 4.0.3

### Patch Changes

- [#63](https://github.com/alauda/ng-monaco-editor/pull/63) [`ae72d0c`](https://github.com/alauda/ng-monaco-editor/commit/ae72d0c5f9f907d9abf41cd2261d18f6220195a1) Thanks [@JounQin](https://github.com/JounQin)! - fix: require could be unavailable when toggle from esm to amd

### [4.0.2](https://github.com/alauda/ng-monaco-editor/compare/v4.0.1...v4.0.2) (2021-05-28)

### Bug Fixes

- improve types for EventEmitter ([#60](https://github.com/alauda/ng-monaco-editor/issues/60)) ([93271db](https://github.com/alauda/ng-monaco-editor/commit/93271dbb075b346489fe7a42db2e18d9d991a8fc))

### [4.0.1](https://github.com/alauda/ng-monaco-editor/compare/v4.0.0...v4.0.1) (2021-05-25)

### Bug Fixes

- replace monaco-editor/esm/vs/editor/editor.api with monaco-editor ([#59](https://github.com/alauda/ng-monaco-editor/issues/59)) ([4f56b36](https://github.com/alauda/ng-monaco-editor/commit/4f56b369249949feed4aaf302ebe768e072f43a2))

## [4.0.0](https://github.com/alauda/ng-monaco-editor/compare/v3.0.3...v4.0.0) (2021-05-24)

### Features

- upgrade angular v12, rxjs v7, webpack v5 ([53dce0f](https://github.com/alauda/ng-monaco-editor/commit/53dce0fdd2de3cb1fc96e44aa67c8db982119194))

### [3.0.3](https://github.com/alauda/ng-monaco-editor/compare/v3.0.2...v3.0.3) (2021-05-02)

### Bug Fixes

- use esm to import monaco namespace. [#53](https://github.com/alauda/ng-monaco-editor/issues/53) ([#54](https://github.com/alauda/ng-monaco-editor/issues/54)) ([fbf838a](https://github.com/alauda/ng-monaco-editor/commit/fbf838a7b66f2dfd2dd5fafc834b536a24b234af))

### [3.0.2](https://github.com/alauda/ng-monaco-editor/compare/v3.0.1...v3.0.2) (2021-04-02)

### [3.0.1](https://github.com/alauda/ng-monaco-editor/compare/v3.0.0...v3.0.1) (2021-03-04)

### Features

- mark isDarkTheme$$ as private ([#46](https://github.com/alauda/ng-monaco-editor/issues/46)) ([25335a8](https://github.com/alauda/ng-monaco-editor/commit/25335a8e4cefa0691dbd8ba72e50aeb6eb6d0fb3))
- support duplicate code editor to change theme ([#45](https://github.com/alauda/ng-monaco-editor/issues/45)) ([8aebf4f](https://github.com/alauda/ng-monaco-editor/commit/8aebf4fc2d0c5141d6d9b33c9f732fb8b7e8fe7e))

### Bug Fixes

- importing all languages and features to esm story ([#43](https://github.com/alauda/ng-monaco-editor/issues/43)) ([4ab29b8](https://github.com/alauda/ng-monaco-editor/commit/4ab29b82f83bf44dba788ab4949c8fca24206f24))

## [3.0.0](https://github.com/alauda/ng-monaco-editor/compare/v2.3.0...v3.0.0) (2021-02-25)

### ⚠ BREAKING CHANGES

- support rerender after content changed (#42)

### Features

- support rerender after content changed ([#42](https://github.com/alauda/ng-monaco-editor/issues/42)) ([3fe6092](https://github.com/alauda/ng-monaco-editor/commit/3fe6092ffd47302453298062b67f24121bcfdf0e)), closes [#2](https://github.com/alauda/ng-monaco-editor/issues/2)
- use GitHub Actions for publishing ([93b55c5](https://github.com/alauda/ng-monaco-editor/commit/93b55c5a1bbfd8f30edd9bd126bbe4247f828c1f))
