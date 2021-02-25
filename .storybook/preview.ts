import '!style-loader!css-loader!sass-loader!./global.scss';

if (/github\.io$/.test(location.hostname)) {
  const base = document.createElement('base');
  base.href = '/ng-monaco-editor/';
  document.head.appendChild(base);
}
