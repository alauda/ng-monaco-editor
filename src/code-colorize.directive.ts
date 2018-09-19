import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MonacoProviderService } from './monaco-provider.service';

/**
 * Colorize a section of code with Monaco Editor.
 * TODO: rerender element when content changes:
 */
@Directive({
  selector: '[ngCodeColorize]',
})
export class CodeColorizeDirective implements OnInit, OnDestroy {
  @Input()
  @HostBinding('attr.data-lang') // Monaco editor use data-lang to identify the language.
  ngCodeColorize: string;

  @Input()
  ngCodeColorizeOptions: { theme: string };

  private destroyed = false;

  constructor(
    private element: ElementRef,
    private monacoProvider: MonacoProviderService,
  ) {}

  ngOnInit() {
    this.doColorize();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private async doColorize() {
    await this.monacoProvider.initMonaco();
    if (this.destroyed) {
      return;
    }
    return this.monacoProvider.colorizeElement(
      this.element.nativeElement,
      this.ngCodeColorizeOptions,
    );
  }
}
