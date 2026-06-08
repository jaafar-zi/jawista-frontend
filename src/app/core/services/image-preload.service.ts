// src/app/core/services/image-preload.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ImagePreloadResult } from '../models/image-preload.model';

@Injectable({ providedIn: 'root' })
export class ImagePreloadService {
  private readonly platformId = inject(PLATFORM_ID);
  private preloadedUrls = new Set<string>();

  // ─── Public API ───────────────────────────────────────────────

  preload(urls: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.getValidUrls(urls).forEach(url => {
      if (!this.preloadedUrls.has(url)) {
        const image = new Image();
        image.src = url;
        this.preloadedUrls.add(url);
      }
    });
  }

  preloadWithStatus(urls: string[]): Observable<ImagePreloadResult[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);

    const validUrls = this.getValidUrls(urls);
    if (!validUrls.length) return of([]);

    return forkJoin(validUrls.map(url => this.loadImage(url)));
  }

  preloadSingle(url: string): Observable<ImagePreloadResult> {
    if (!url?.trim()) {
      return of({ url, success: false, error: 'Empty URL' });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return of({ url, success: false, error: 'SSR: Image not available' });
    }

    return this.loadImage(url);
  }

  isPreloaded(url: string): boolean {
    return this.preloadedUrls.has(url);
  }

  clearCache(): void {
    this.preloadedUrls.clear();
  }

  // ─── Private ─────────────────────────────────────────────────

  private loadImage(url: string): Observable<ImagePreloadResult> {
    if (this.preloadedUrls.has(url)) {
      return of({ url, success: true });
    }

    const result$ = new Subject<ImagePreloadResult>();
    const image = new Image();

    image.onload = () => {
      this.preloadedUrls.add(url);
      result$.next({ url, success: true });
      result$.complete();
    };

    image.onerror = () => {
      result$.next({
        url,
        success: false,
        error: `Failed to load: ${url}`,
      });
      result$.complete();
    };

    image.src = url;
    return result$.asObservable();
  }

  private getValidUrls(urls: string[]): string[] {
    return urls.filter(url => !!url?.trim());
  }
}