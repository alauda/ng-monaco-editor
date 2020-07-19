import { Injectable } from '@angular/core';
// TODO: extract it as native ES module
import ResizeSensor, {
  ResizeSensorCallback,
} from 'css-element-queries/src/ResizeSensor'; // for smaller bundle size

@Injectable()
export class ResizeSensorService {
  registerResize(
    element: Element | Element[],
    onResize: ResizeSensorCallback,
  ): ResizeSensor {
    return new ResizeSensor(element, onResize);
  }
}
