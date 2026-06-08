import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appHoverFollow]'
})
export class HoverFollowDirective implements AfterViewInit {

  private overlay!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.overlay = this.el.nativeElement.querySelector('.overlay-inner');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.overlay) return;

    const rect = this.el.nativeElement.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 14;
    const moveY = (y / rect.height - 0.5) * 14;

    this.renderer.setStyle(
      this.overlay,
      'transform',
      `translate(${moveX}px, ${moveY}px)`
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.overlay) return;

    this.renderer.setStyle(
      this.overlay,
      'transform',
      'translate(0px, 10px)'
    );
  }
}