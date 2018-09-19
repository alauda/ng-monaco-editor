declare module 'css-element-queries' {
  import ResizeSensor from 'css-element-queries/src/ResizeSensor';
  export { ResizeSensor };
}

declare module 'lodash.debounce' {
  import { debounce } from 'lodash';
  export default debounce;
}

declare module 'lodash.isequal' {
  import { isEqual } from 'lodash';
  export default isEqual;
}
