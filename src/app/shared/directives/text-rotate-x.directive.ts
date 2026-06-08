import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[textRotateX]',
  standalone: true
})
export class TextRotateXDirective implements OnInit, OnDestroy {
    
  @Input() rotateXDuration = '500ms';
  @Input() rotateXEasing = 'cubic-bezier(0.76, 0, 0.24, 1)';

  private detailWrap: HTMLElement | null = null;
  private detailText: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.detailWrap = this.el.nativeElement.querySelector('.detail-wrap');
    this.detailText = this.el.nativeElement.querySelector('.detail-text');
    this.applyBaseStyles();
  }

  ngOnDestroy(): void {
    this.setHovered(false);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.setHovered(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setHovered(false);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.setHovered(true);
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.setHovered(false);
  }

  private setHovered(active: boolean): void {
    const method = active ? 'addClass' : 'removeClass';
    this.renderer[method](this.el.nativeElement, 'is-hovered');
  }

  private applyBaseStyles(): void {
    if (!this.detailWrap || !this.detailText) return;

    // apply duration/easing overrides if provided via inputs
    this.renderer.setStyle(
      this.detailWrap,
      'transition',
      `transform ${this.rotateXDuration} ${this.rotateXEasing}`
    );
    this.renderer.setStyle(
      this.detailText,
      'transition',
      `transform ${this.rotateXDuration} ${this.rotateXEasing}`
    );
  }
}