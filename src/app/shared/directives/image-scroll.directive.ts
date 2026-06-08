import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';

/**
 * Matches the `img-scroll=""` attribute pattern on the original Odd Ritual site.
 * Applies a GSAP-based parallax translation to the host image.
 *
 * Usage:
 *   <img appImgScroll [scrollStrength]="0.15" ... />
 *   <div appImgScroll [scrollStrength]="0.2"> ... </div>
 */
@Directive({
  selector: '[appImgScroll]',
  standalone: true,
})
export class ImgScrollDirective implements AfterViewInit, OnDestroy {
  /** Fraction of container height to translate (0.1 = 10%). */
  @Input() scrollStrength = 0.15;

  private cleanup?: () => void;

  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const win = window as any;
      if (!win.gsap || !win.ScrollTrigger) return;

      const gsap = win.gsap;
      const ScrollTrigger = win.ScrollTrigger;

      const tween = gsap.to(this.el.nativeElement, {
        yPercent: this.scrollStrength * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement.closest('[class*="img-section"], [class*="about-img"], [class*="split-col"]') ?? this.el.nativeElement.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      this.cleanup = () => tween.kill();
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}