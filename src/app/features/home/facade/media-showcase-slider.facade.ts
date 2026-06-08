// media-showcase-slider.facade.ts

import {
  Injectable,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, fromEvent, forkJoin, of } from 'rxjs';
import { takeUntil, throttleTime, catchError } from 'rxjs/operators';
import { CursorPosition, NavigationDirection, SlideContent } from '../../../core/models/media-showcase-slider.model';
import { MediaService } from '../../../core/services/media.service';

/**
 * Gallery slides use BANNER owner type with IDs 30–36.
 */
const GALLERY_BASE_OWNER_ID = 30;

@Injectable()
export class MediaShowcaseSliderFacade implements OnDestroy {

  private readonly mediaService = inject(MediaService);

  // ── Public State ─────────────────────────────────────────────────────────────

  currentIndex = 0;
  cursorPosition: CursorPosition = { x: 0, y: 0 };
  navigationDirection: NavigationDirection = NavigationDirection.NONE;
  showCursor = false;
  isTransitioning = false;
  isBrowser: boolean;

  // ── Configuration ─────────────────────────────────────────────────────────────

  readonly NAVIGATION_THRESHOLD = 0.5;
  readonly THROTTLE_TIME = 16;
  readonly TRANSITION_DURATION = 600;
  readonly MOBILE_BREAKPOINT = 768;
  readonly SWIPE_THRESHOLD = 50;

  // ── Slides (mutable — updated with backend URLs) ──────────────────────────────

  slides: SlideContent[] = [
    { id: 'slide-1', imageUrl: 'Home_Gallery1.jpg' },
    { id: 'slide-2', imageUrl: 'Home_Gallery2.jpg' },
    { id: 'slide-3', imageUrl: 'Home_Gallery3.jpg' },
    { id: 'slide-4', imageUrl: 'Home_Gallery4.jpg' },
    { id: 'slide-5', imageUrl: 'Home_Gallery5.jpg' },
    { id: 'slide-6', imageUrl: 'Home_Gallery6.jpg' },
    { id: 'slide-7', imageUrl: 'Home_Gallery7.jpg' },
  ];

  // ── Touch ─────────────────────────────────────────────────────────────────────

  private touchStartX = 0;
  private touchEndX = 0;

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  private destroy$ = new Subject<void>();
  private cdr!: ChangeDetectorRef;

  constructor(
    private transloco: TranslocoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ── Init / Destroy ────────────────────────────────────────────────────────────

  init(cdr: ChangeDetectorRef, sliderEl?: HTMLDivElement): void {
    this.cdr = cdr;

    if (this.isBrowser) {
      this.initMouseTracking();
      this.initTouchHandling(sliderEl);
      this.loadGalleryImages();
    }
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  // ── Backend Media Loading ─────────────────────────────────────────────────────

  /**
   * Fetch backend images for each gallery slide.
   * BANNER/30 = slide-1, BANNER/31 = slide-2, etc.
   * If backend has an asset → override imageUrl.
   * If not → keep hardcoded fallback.
   * After all resolve → preload images.
   */
  private loadGalleryImages(): void {
    const requests = this.slides.map((slide, index) =>
      this.mediaService.getAssetUrl(
        'BANNER',
        GALLERY_BASE_OWNER_ID + index,
        slide.imageUrl
      ).pipe(
        catchError(() => of(slide.imageUrl))
      )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(urls => {
        this.slides = this.slides.map((slide, index) => ({
          ...slide,
          imageUrl: urls[index]
        }));
        this.preloadImages();
        this.cdr.markForCheck();
      });
  }

  // ── Mouse Tracking ────────────────────────────────────────────────────────────

  private initMouseTracking(): void {
    if (this.isMobileDevice()) return;

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        throttleTime(this.THROTTLE_TIME, undefined, {
          leading: true,
          trailing: true,
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => this.handleMouseMove(event));
  }

  private handleMouseMove(event: MouseEvent): void {
    this.cursorPosition = { x: event.clientX, y: event.clientY };
    if (!this.isNavZoneActive) {
      this.updateNavigationDirection(event.clientX);
    }
    this.cdr.markForCheck();
  }

  private updateNavigationDirection(clientX: number): void {
    const threshold = window.innerWidth * this.NAVIGATION_THRESHOLD;
    this.navigationDirection =
      clientX > threshold
        ? NavigationDirection.NEXT
        : NavigationDirection.PREV;
  }

  // ── Touch Handling ────────────────────────────────────────────────────────────

  private initTouchHandling(sliderEl?: HTMLDivElement): void {
    if (!sliderEl) return;

    fromEvent<TouchEvent>(sliderEl, 'touchstart')
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.handleTouchStart(e));

    fromEvent<TouchEvent>(sliderEl, 'touchend')
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.handleTouchEnd(e));
  }

  private handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  private handleTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const distance = this.touchStartX - this.touchEndX;
    if (Math.abs(distance) < this.SWIPE_THRESHOLD) return;
    distance > 0 ? this.navigateNext() : this.navigatePrev();
  }

  // ── Nav Zone Control ──────────────────────────────────────────────────────────

  private isNavZoneActive = false;

  setNavigationDirection(direction: NavigationDirection | ''): void {
    if (direction === '') {
      this.isNavZoneActive = false;
      this.navigationDirection = NavigationDirection.NONE;
    } else {
      this.isNavZoneActive = true;
      this.navigationDirection = direction as NavigationDirection;
    }
    this.cdr.markForCheck();
  }

  // ── Host-Event Delegates ──────────────────────────────────────────────────────

  onMouseEnter(): void {
    if (!this.isMobileDevice()) {
      this.showCursor = true;
      this.cdr.markForCheck();
    }
  }

  onMouseLeave(): void {
    this.showCursor = false;
    this.isNavZoneActive = false;
    this.navigationDirection = NavigationDirection.NONE;
    this.cdr.markForCheck();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isTransitioning) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigatePrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateNext();
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  navigateNext(): void {
    if (!this.canNavigateNext() || this.isTransitioning) return;
    this.transition(() => this.currentIndex++);
  }

  navigatePrev(): void {
    if (!this.canNavigatePrev() || this.isTransitioning) return;
    this.transition(() => this.currentIndex--);
  }

  nextSlide(): void {
    this.navigateNext();
  }

  prevSlide(): void {
    this.navigatePrev();
  }

  goToSlide(index: number): void {
    if (
      index === this.currentIndex ||
      this.isTransitioning ||
      index < 0 ||
      index >= this.slides.length
    ) return;

    this.transition(() => (this.currentIndex = index));
  }

  private transition(mutateFn: () => void): void {
    this.isTransitioning = true;
    mutateFn();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.isTransitioning = false;
      this.cdr.markForCheck();
    }, this.TRANSITION_DURATION);
  }

  canNavigateNext(): boolean {
    return this.currentIndex < this.slides.length - 1;
  }

  canNavigatePrev(): boolean {
    return this.currentIndex > 0;
  }

  // ── Computed Getters ──────────────────────────────────────────────────────────

  get currentSlide(): SlideContent {
    return this.slides[this.currentIndex];
  }

  get formattedSlideNumber(): string {
    return String(this.currentIndex + 1).padStart(2, '0');
  }

  get cursorStyles(): { [key: string]: string } {
    return {
      left: `${this.cursorPosition.x}px`,
      top: `${this.cursorPosition.y}px`,
    };
  }

  get collectionName(): string {
    return this.transloco.translate('home.showcaseSlider.footer.collectionName');
  }

  get navigationText(): string {
    if (this.navigationDirection === NavigationDirection.NEXT) {
      return this.transloco.translate('home.showcaseSlider.cursor.next');
    }
    if (this.navigationDirection === NavigationDirection.PREV) {
      return this.transloco.translate('home.showcaseSlider.cursor.prev');
    }
    return '';
  }

  get liveStatusAnnouncement(): string {
    return this.transloco.translate('home.showcaseSlider.slides.liveStatus', {
      current: this.currentIndex + 1,
      total: this.slides.length,
    });
  }

  // ── Per-Slide Helpers ─────────────────────────────────────────────────────────

  getSlideAriaLabel(index: number): string {
    return this.transloco.translate(
      'home.showcaseSlider.slides.slideAriaLabel',
      { current: index + 1, total: this.slides.length }
    );
  }

  getIndicatorAriaLabel(index: number): string {
    return this.transloco.translate(
      'home.showcaseSlider.slides.indicatorAriaLabel',
      { index: index + 1 }
    );
  }

  // ── Utilities ─────────────────────────────────────────────────────────────────

  trackBySlideId(_index: number, slide: SlideContent): string {
    return slide.id;
  }

  isMobileDevice(): boolean {
    if (!this.isBrowser) return false;
    return (
      window.innerWidth <= this.MOBILE_BREAKPOINT ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }

  private preloadImages(): void {
    this.slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }
}