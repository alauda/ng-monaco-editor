import { Injectable } from '@angular/core';
import { ResizeSensor, ResizeSensorCallback } from 'css-element-queries';

@Injectable()
export class ResizeSensorService {
  registerResize(
    element: Element | Element[],
    onResize: ResizeSensorCallback,
  ): ResizeSensor {
    return new ResizeSensor(element, onResize);
  }
}
