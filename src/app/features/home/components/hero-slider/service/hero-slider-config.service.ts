// src/app/features/home/components/hero-slider/service/hero-slider-config.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  HeroSlideConfig,
  HeroSliderSettings,
} from '../../../../../core/models/hero-slider.model';

@Injectable({ providedIn: 'root' })
export class HeroSliderConfigService {

  private readonly platformId = inject(PLATFORM_ID);

  private readonly CACHE_KEY      = 'hero_slides_cache';
  private readonly CACHE_DURATION = 3600000;

  private slidesSubject = new BehaviorSubject<HeroSlideConfig[]>([]);
  private settingsSubject = new BehaviorSubject<HeroSliderSettings>({
    autoPlay:           true,
    autoPlayInterval:   5000,
    enableKeyboardNav:  true,
    enableMouseWheel:   true,
    enableTouchSwipe:   true,
    transitionDuration: 1000,
  });

  readonly slides$   = this.slidesSubject.asObservable();
  readonly settings$ = this.settingsSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.clearCache();
      this.loadFromCache();
    }
  }

  loadSlides(forceRefresh = false): Observable<HeroSlideConfig[]> {
    if (!isPlatformBrowser(this.platformId)) {
      const defaults = this.getDefaultSlides();
      this.slidesSubject.next(defaults);
      return of(defaults);
    }

    if (!forceRefresh) {
      const cached = this.getFromCache();
      if (cached) {
        this.slidesSubject.next(cached);
        return of(cached);
      }
    }

    const slides = this.filterActiveSlides(this.getDefaultSlides());
    const sorted = this.sortByPriority(slides);

    this.saveToCache(sorted);
    this.slidesSubject.next(sorted);

    return of(sorted);
  }

  loadSettings(): Observable<HeroSliderSettings> {
    return of(this.settingsSubject.value);
  }

  /**
   * Called by the facade after merging backend media.
   */
  updateSlidesWithMedia(updatedSlides: HeroSlideConfig[]): void {
    this.slidesSubject.next(updatedSlides);
    this.saveToCache(updatedSlides);
  }

  trackSlideView(slideId: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  trackSlideClick(slideId: number, ctaLink: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  getSlidesForVariant(variantId: string): Observable<HeroSlideConfig[]> {
    return of(this.filterActiveSlides(this.getDefaultSlides()));
  }

  updateSlideOrder(slideIds: number[]): Observable<void> {
    const current = this.slidesSubject.value;
    const reordered = slideIds
      .map(id => current.find(s => s.id === id))
      .filter((s): s is HeroSlideConfig => !!s);

    this.slidesSubject.next(reordered);
    return of(void 0);
  }

  refresh(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearCache();
    }
    this.loadSlides(true).subscribe();
    this.loadSettings().subscribe();
  }

  getCurrentSlides(): HeroSlideConfig[] {
    return this.slidesSubject.value;
  }

  getCurrentSettings(): HeroSliderSettings {
    return this.settingsSubject.value;
  }

  // ─── Private ─────────────────────────────────────────────────

  private filterActiveSlides(slides: HeroSlideConfig[]): HeroSlideConfig[] {
    const now = new Date();
    return slides.filter(slide => {
      if (slide.isActive === false) return false;
      if (slide.publishDate && new Date(slide.publishDate) > now) return false;
      if (slide.expiryDate  && new Date(slide.expiryDate)  < now) return false;
      return true;
    });
  }

  private sortByPriority(slides: HeroSlideConfig[]): HeroSlideConfig[] {
    return [...slides].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );
  }

  private saveToCache(slides: HeroSlideConfig[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(
        this.CACHE_KEY,
        JSON.stringify({ slides, timestamp: Date.now() })
      );
    } catch {
    }
  }

  private getFromCache(): HeroSlideConfig[] | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return null;

      const { slides, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }
      return slides;
    } catch {
      return null;
    }
  }

  private loadFromCache(): void {
    const cached = this.getFromCache();
    if (cached) this.slidesSubject.next(cached);
  }

  private clearCache(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.CACHE_KEY);
  }

  getDefaultSlides(): HeroSlideConfig[] {
    return [
      {
        id:         3,
        image:      'hero_01.jpg',
        thumbnail:  'hero_01.jpg',
        titleKey:   'home.heroSlider.slides.0.title',
        ctaTextKey: 'home.heroSlider.slides.0.ctaText',
        ctaLink:    '/collections/all',
        isActive:   true,
        priority:   3,
      },
      {
        id:         2,
        image:      'hero_02.jpg',
        thumbnail:  'hero_02.jpg',
        titleKey:   'home.heroSlider.slides.1.title',
        ctaTextKey: 'home.heroSlider.slides.1.ctaText',
        ctaLink:    '/about',
        isActive:   true,
        priority:   2,
      },
      {
        id:         1,
        image:      'hero_03.jpg',
        thumbnail:  'hero_03.jpg',
        titleKey:   'home.heroSlider.slides.2.title',
        ctaTextKey: 'home.heroSlider.slides.2.ctaText',
        ctaLink:    'https://www.instagram.com/jawista.club/',
        isExternal: true,
        isActive:   true,
        priority:   1,
      },
    ];
  }
}