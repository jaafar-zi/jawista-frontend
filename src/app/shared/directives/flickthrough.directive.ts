import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService } from '../../core/services/logger.service';

@Directive({
  selector: '[appFlickthroughImgHover]',
  standalone: false,
})
export class FlickthroughImgHoverDirective {
  constructor(public el: ElementRef<HTMLElement>) {}
}

@Directive({
  selector: '[appFlickthroughHover]',
  standalone: false,
})
export class FlickthroughHoverDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(FlickthroughImgHoverDirective, { descendants: true })
  images!: QueryList<FlickthroughImgHoverDirective>;

  @Input() appFlickthroughHoverInterval = 220;

  private currentIndex = 0;
  private intervalId: number | null = null;
  private changesSub?: Subscription;
  private isInitialized = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private logger: LoggerService
  ) {}

  ngAfterContentInit(): void {
    queueMicrotask(() => {
      this.ngZone.runOutsideAngular(() => {
        this.initialize();

        this.changesSub = this.images.changes.subscribe(() => {
          this.stop(false);
          this.initialize();
        });
      });
    });
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.start();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.stop(true);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.start();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.stop(true);
  }

  private initialize(): void {
    const imgs = this.images?.toArray() ?? [];
    const container = this.el.nativeElement;

    if (!imgs.length) {
      this.isInitialized = false;
      container.classList.remove('is-initialized');
      this.logger.warn('FlickthroughHoverDirective: No images found');
      return;
    }

    imgs.forEach((img) => {
      img.el.nativeElement.classList.remove('show');
    });

    this.currentIndex = 0;
    imgs[0].el.nativeElement.classList.add('show');

    container.classList.add('is-initialized');
    this.isInitialized = true;

    this.logger.log(`FlickthroughHoverDirective initialized with ${imgs.length} images`);
  }

  private start(): void {
    const imgs = this.images?.toArray() ?? [];

    if (!this.isInitialized || imgs.length < 2 || this.intervalId !== null) {
      return;
    }

    this.intervalId = window.setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % imgs.length;
      this.setVisibleImage(nextIndex);
    }, this.appFlickthroughHoverInterval);
  }

  private stop(resetToFirst: boolean): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (resetToFirst && this.isInitialized) {
      this.setVisibleImage(0);
    }
  }

  private setVisibleImage(newIndex: number): void {
    const imgs = this.images?.toArray() ?? [];

    if (!imgs.length || newIndex === this.currentIndex || !imgs[newIndex]) {
      return;
    }

    imgs[this.currentIndex]?.el.nativeElement.classList.remove('show');
    imgs[newIndex].el.nativeElement.classList.add('show');
    this.currentIndex = newIndex;
  }

  ngOnDestroy(): void {
    this.stop(false);
    this.changesSub?.unsubscribe();
  }
}