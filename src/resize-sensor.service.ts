import { Injectable } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';

@Injectable()
export class ResizeSensorService {
  registerResize(element: any, onResize: () => void): ResizeSensor {
    return new ResizeSensor(element, onResize);
  }
}
