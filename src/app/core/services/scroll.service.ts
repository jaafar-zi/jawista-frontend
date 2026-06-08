import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

export interface ScrollState {
  scrollY: number;
  direction: 'up' | 'down';
  velocity: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private lenis: any = null;
  private gsap: any = null;
  private ScrollTrigger: any = null;

  private _scrollState$ = new BehaviorSubject<ScrollState>({
    scrollY: 0,
    direction: 'down',
    velocity: 0,
  });
  readonly scrollState$ = this._scrollState$.asObservable();

  constructor(private ngZone: NgZone) {}

  /**
   * Call once from AppComponent.ngOnInit after GSAP + Lenis
   * are available on window (loaded via <script> tags in index.html).
   */
  init(): void {
    this.ngZone.runOutsideAngular(() => {
      const win = window as any;

      // ----- Lenis smooth scroll -----
      if (win.Lenis) {
        this.lenis = new win.Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

        const raf = (time: number) => {
          this.lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }

      // ----- GSAP ScrollTrigger -----
      if (win.gsap && win.ScrollTrigger) {
        this.gsap = win.gsap;
        this.ScrollTrigger = win.ScrollTrigger;
        this.gsap.registerPlugin(this.ScrollTrigger);

        if (this.lenis) {
          this.lenis.on('scroll', this.ScrollTrigger.update);
          this.gsap.ticker.add((time: number) => this.lenis.raf(time * 1000));
          this.gsap.ticker.lagSmoothing(0);
        }
      }

      // ----- Raw scroll state tracking -----
      let lastY = 0;
      fromEvent(window, 'scroll', { passive: true })
        .pipe(takeUntil(this.destroy$), throttleTime(16))
        .subscribe(() => {
          const y = window.scrollY;
          const dir: 'up' | 'down' = y > lastY ? 'down' : 'up';
          const vel = Math.abs(y - lastY);
          lastY = y;
          this._scrollState$.next({ scrollY: y, direction: dir, velocity: vel });
        });
    });
  }

  /**
   * Register a GSAP ScrollTrigger for parallax image movement.
   * Matches the `img-scroll` attribute pattern from the original site.
   */
  registerParallaxImage(element: HTMLElement, strength = 0.15): () => void {
    if (!this.gsap || !this.ScrollTrigger) return () => {};

    const trigger = this.gsap.to(element, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => trigger.kill();
  }

  /**
   * Scroll to a specific position with Lenis smooth scroll.
   */
  scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.lenis?.destroy();
  }
}