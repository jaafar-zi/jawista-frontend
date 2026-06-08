// src/app/features/about/facade/about.facade.ts

import { Injectable, inject, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';

import { APP_CONFIG } from '../../../core/constants/app-config.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { ASSET_PATHS } from '../../../core/constants/asset-paths.constants';
import { ImageSectionConfig } from '../../../core/models/image-section.model';
import { FlickthroughImage } from '../../../core/models/flick-through-image.model';
import { StickyItem } from '../../../core/models/about.model';
import { MediaService } from '../../../core/services/media.service';

const ABOUT_MEDIA_IDS = {
  imageSection: 41,
  rightImage: 42,
  flickthroughBase: 50,
  stickyGalleryBase: 60
} as const;

@Injectable({ providedIn: 'root' })
export class AboutFacade implements OnDestroy {

  private readonly mediaService = inject(MediaService);
  private readonly destroy$ = new Subject<void>();

  readonly instagramUrl = APP_CONFIG.social.instagram;
  readonly productsRoute = APP_ROUTES.collections.all;
  readonly stickyFallbackImages = APP_CONSTANTS.stickyGallery.fallbackImages;
  readonly fallbackRightImageUrl: string = APP_CONSTANTS.splitContent.rightImageUrl;

  readonly imageSectionConfig: ImageSectionConfig = {
    imageUrl: APP_CONSTANTS.imageSection.defaultImageUrl,
    leftTextKey: 'about.imageSection.defaults.leftText',
    centerTextKey: 'about.imageSection.defaults.centerText',
    rightTextKey: 'about.imageSection.defaults.rightText',
    mediaOwnerType: 'BANNER',
    mediaOwnerId: ABOUT_MEDIA_IDS.imageSection
  };

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Right image ──────────────────────────────────────────────

  loadRightImageUrl(callback: (url: string) => void): void {
    this.mediaService
      .getAssetUrl(
        'BANNER',
        ABOUT_MEDIA_IDS.rightImage,
        this.fallbackRightImageUrl
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        callback(url);
      });
  }

  // ── Flickthrough ─────────────────────────────────────────────

  getFlickthroughImages(): FlickthroughImage[] {
    return ASSET_PATHS.images.about.flickthrough.map((fallbackUrl, i) => ({
      url: fallbackUrl
    }));
  }

  getFlickthroughImagesWithMedia(
    callback: (images: FlickthroughImage[]) => void
  ): void {
    const fallbackImages = ASSET_PATHS.images.about.flickthrough;

    const requests = fallbackImages.map((fallbackUrl, i) =>
      this.mediaService.getAssetUrl(
        'BANNER',
        ABOUT_MEDIA_IDS.flickthroughBase + i,
        fallbackUrl
      )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(urls => {
        const images: FlickthroughImage[] = urls.map((url, i) => ({
          url
        }));

        callback(images);
      });
  }

  // ── Sticky gallery ───────────────────────────────────────────

  getStickyGalleryItems(): StickyItem[] {
    return APP_CONSTANTS.stickyGallery.defaultItems.map(item => ({
      ...item
    }));
  }

  getStickyGalleryItemsWithMedia(
    callback: (items: StickyItem[]) => void
  ): void {
    const defaultItems = APP_CONSTANTS.stickyGallery.defaultItems;

    const requests = defaultItems.map((item, i) =>
      this.mediaService.getAssetUrl(
        'BANNER',
        ABOUT_MEDIA_IDS.stickyGalleryBase + i,
        item.imageUrl
      )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(urls => {
        const items: StickyItem[] = defaultItems.map((item, i) => ({
          ...item,
          imageUrl: urls[i]
        }));

        callback(items);
      });
  }
}