import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { FlickthroughImage } from '../../../../core/models/flick-through-image.model';
import { MediaService } from '../../../../core/services/media.service';

const SPLIT_GRID_MEDIA_IDS = {
  mainImage: 70,
  flickthroughBase: 71
} as const;

@Component({
  selector: 'app-split-grid',
  standalone: false,
  templateUrl: './split-grid.component.html',
  styleUrls: ['./split-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitGridComponent implements OnInit, OnDestroy {

  private readonly mediaService = inject(MediaService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  mainImage: FlickthroughImage = {
    url: 'split-grid-fixed-img.jpg'
  };

  flickthroughImages: FlickthroughImage[] = [
    { url: 'Home_Gallery1.jpg' },
    { url: 'Home_Gallery2.jpg' },
    { url: 'Home_Gallery3.jpg' },
    { url: 'Home_Gallery4.jpg' },
    { url: 'Home_Gallery5.jpg' },
  ];

  ngOnInit(): void {
    this.loadMainImage();
    this.loadFlickthroughImages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Private ───────────────────────────────────────────────────

  /**
   * BANNER/70 = split-grid fixed image
   */
  private loadMainImage(): void {
    this.mediaService
      .getAssetUrl('BANNER', SPLIT_GRID_MEDIA_IDS.mainImage, this.mainImage.url)
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        this.mainImage = { ...this.mainImage, url };
        this.cdr.markForCheck();
      });
  }

  /**
   * BANNER/71..75 = split-grid flickthrough images
   */
  private loadFlickthroughImages(): void {
    const requests = this.flickthroughImages.map((image, index) =>
      this.mediaService
        .getAssetUrl(
          'BANNER',
          SPLIT_GRID_MEDIA_IDS.flickthroughBase + index,
          image.url
        )
        .pipe(
          catchError(() => of(image.url))
        )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(urls => {
        this.flickthroughImages = this.flickthroughImages.map((image, index) => ({
          ...image,
          url: urls[index]
        }));
        this.cdr.markForCheck();
      });
  }
}