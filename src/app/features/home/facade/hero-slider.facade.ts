// src/app/features/home/facade/hero-slider.facade.ts

import { inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { HeroSliderConfigService } from '../components/hero-slider/service/hero-slider-config.service';
import { ImagePreloadService } from '../../../core/services/image-preload.service';
import { ViewportService } from '../../../core/services/viewport.service';
import { MediaService } from '../../../core/services/media.service';
import { AssetResponse } from '../../../api/models/asset-response';
import {
  HeroSlideConfig,
  HeroSliderSettings
} from '../../../core/models/hero-slider.model';

@Injectable()
export class HeroSliderFacade {
  currentSlide = 0;
  isAnimating = false;
  isMobile = false;
  slides: HeroSlideConfig[] = [];
  settings: HeroSliderSettings = {
    autoPlay: false,
    autoPlayInterval: 0,
    enableKeyboardNav: false,
    enableMouseWheel: false,
    enableTouchSwipe: false,
    transitionDuration: 0
  };

  private readonly destroy$ = new Subject<void>();
  private readonly viewedSlides = new Set<number>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly mediaService = inject(MediaService);

  private readonly defaultTransitionDuration = 300;

  constructor(
    private router: Router,
    private configService: HeroSliderConfigService,
    private viewportService: ViewportService,
    private imagePreloadService: ImagePreloadService
  ) {}

  init(): void {
    this.checkMobile();
    this.loadConfiguration();
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onResize(): void {
    this.checkMobile();
  }

  goToSlide(index: number): void {
    if (
      !this.slides.length ||
      this.isAnimating ||
      index === this.currentSlide ||
      index < 0 ||
      index >= this.slides.length
    ) {
      return;
    }

    this.isAnimating = true;
    this.currentSlide = index;
    this.trackSlideView(this.slides[index].id);

    const duration = this.getTransitionDuration();

    this.ngZone.runOutsideAngular(() => {
      timer(duration)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.isAnimating = false;
          });
        });
    });
  }

  nextSlide(): void {
    if (!this.slides.length) return;
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide(): void {
    if (!this.slides.length) return;
    const prevIndex =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  navigateTo(slide: HeroSlideConfig): void {
    this.configService.trackSlideClick(slide.id, slide.ctaLink);

    if (slide.isExternal) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(slide.ctaLink, '_blank', 'noopener,noreferrer');
      }
    } else {
      this.router.navigate([slide.ctaLink]);
    }
  }

  isSlideActive(index: number): boolean {
    return this.currentSlide === index;
  }

  getSlideNumber(index: number): string {
    return (index + 1).toString().padStart(2, '0');
  }

  trackBySlideId(_index: number, slide: HeroSlideConfig): number {
    return slide.id;
  }

  refreshSlides(): void {
    this.configService
      .loadSlides(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(slides => {
        this.applyBackendMedia(slides);
      });
  }

  // ── Private ───────────────────────────────────────────────────

  private loadConfiguration(): void {
    this.configService
      .loadSlides()
      .pipe(takeUntil(this.destroy$))
      .subscribe(slides => {
        this.applyBackendMedia(slides);
      });

    this.configService
      .loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.settings = settings;
      });

    this.configService.slides$
      .pipe(takeUntil(this.destroy$))
      .subscribe(slides => {
        this.slides = slides;

        if (this.currentSlide >= slides.length) {
          this.currentSlide = 0;
        }
      });
  }

  /**
   * For each slide, fetch backend media using:
   *   ownerType = 'HERO'
   *   ownerId   = slide.id  (1, 2, 3)
   *
   * If backend returns assets → use the primary asset URL
   * If backend returns empty  → keep hardcoded image
   */
  private applyBackendMedia(slides: HeroSlideConfig[]): void {
    let completed = 0;
    const updatedSlides = [...slides];

    if (!slides.length) {
      this.setSlides(slides);
      return;
    }

    slides.forEach((slide, index) => {
      this.mediaService
        .getAssets('HERO', slide.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (assets: AssetResponse[]) => {
            if (assets && assets.length > 0) {
              const primary = assets.find(a => a.isPrimary) ?? assets[0];
              updatedSlides[index] = {
                ...slide,
                image:     primary.url,
                thumbnail: this.findThumbnail(assets) ?? primary.url
              };
            }
            // else: keep hardcoded image/thumbnail

            completed++;
            if (completed === slides.length) {
              this.setSlides(updatedSlides);
            }
          },
          error: () => {
            // Backend error for this slide → keep hardcoded
            completed++;
            if (completed === slides.length) {
              this.setSlides(updatedSlides);
            }
          }
        });
    });
  }

  /**
   * Find a THUMBNAIL-purpose asset, if one exists.
   */
  private findThumbnail(assets: AssetResponse[]): string | null {
    const thumb = assets.find(a => a.purpose === 'THUMBNAIL');
    return thumb?.url ?? null;
  }

  /**
   * Finalize slides: update config service, preload images, set initial index.
   */
  private setSlides(slides: HeroSlideConfig[]): void {
    this.slides = slides;
    this.configService.updateSlidesWithMedia(slides);
    this.preloadImages(slides);

    if (slides.length > 0) {
      this.currentSlide = -1;

      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          this.currentSlide = 0;
          this.trackSlideView(slides[0].id);
        });
      } else {
        this.currentSlide = 0;
        this.trackSlideView(slides[0].id);
      }
    }
  }

  private checkMobile(): void {
    this.isMobile = this.viewportService.isMobile(768);
  }

  private preloadImages(slides: HeroSlideConfig[] = this.slides): void {
    if (!isPlatformBrowser(this.platformId) || !slides.length) return;

    const priorityUrls = slides
      .slice(0, 2)
      .flatMap(slide => [slide.image, slide.thumbnail]);

    this.imagePreloadService.preload(priorityUrls);

    const remainingUrls = slides
      .slice(2)
      .flatMap(slide => [slide.image, slide.thumbnail]);

    if (remainingUrls.length) {
      setTimeout(() => {
        this.imagePreloadService.preload(remainingUrls);
      }, 0);
    }
  }

  private getTransitionDuration(): number {
    const configured = this.settings.transitionDuration || 0;

    if (configured <= 0) {
      return this.defaultTransitionDuration;
    }

    return Math.min(configured, this.defaultTransitionDuration);
  }

  private trackSlideView(slideId: number): void {
    if (!this.viewedSlides.has(slideId)) {
      this.configService.trackSlideView(slideId);
      this.viewedSlides.add(slideId);
    }
  }
}