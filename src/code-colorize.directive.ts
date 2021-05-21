import {
  AfterContentChecked,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MonacoProviderService } from './monaco-provider.service';

/**
 * Colorize a section of code with Monaco Editor.
 */
@Directive({
  selector: '[ngCodeColorize]',
})
export class CodeColorizeDirective
  implements OnInit, AfterContentChecked, OnDestroy
{
  @Input()
  ngCodeColorize!: string;

  @Input()
  ngCodeColorizeOptions?: { theme: string };

  private originalDisplay!: string;
  private lastContent!: string;

  private destroyed = false;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly monacoProvider: MonacoProviderService,
  ) {}

  ngOnInit() {
    const el = this.element.nativeElement;
    this.originalDisplay = el.style.display;
    el.style.display = 'none';
  }

  ngAfterContentChecked() {
    const el = this.element.nativeElement;
    if (this.lastContent === el.innerHTML) {
      return;
    }
    this.lastContent = el.innerHTML;
    this.doColorize();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private async doColorize() {
    if (this.destroyed) {
      return;
    }
    const el = this.element.nativeElement;
    const siblingEl = el.nextElementSibling as HTMLElement;
    const useSiblingEl = siblingEl?.dataset.ngCodeColorizeCloned;
    const nextEl = useSiblingEl
      ? siblingEl
      : (el.cloneNode(true) as HTMLElement);
    if (useSiblingEl) {
      nextEl.innerHTML = el.innerHTML;
      nextEl.className = nextEl.className
        .split(' ')
        .filter(_ => _ !== 'vs')
        .join('')
        .trim();
    } else {
      nextEl.style.display = this.originalDisplay;
      nextEl.dataset.ngCodeColorizeCloned = 'true';
      el.parentNode!.insertBefore(nextEl, el.nextSibling);
    }
    // Monaco editor use data-lang to identify the language.
    nextEl.dataset.lang = this.ngCodeColorize;
    await this.monacoProvider.initMonaco();
    await this.monacoProvider.colorizeElement(
      nextEl,
      this.ngCodeColorizeOptions,
    );
  }
}
