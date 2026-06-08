// src/app/features/home/facade/home.facade.ts

import {
  Injectable,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReplaySubject, BehaviorSubject, Subject, forkJoin, of } from 'rxjs';
import { distinctUntilChanged, take, takeUntil, tap, catchError, map } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { MediaService } from '../../../core/services/media.service';
import { Product } from '../../../shared/models/product.model';
import { ASSET_PATHS } from '../../../core/constants/asset-paths.constants';
import { ColumnItem } from '../../../core/models/column-item.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

const NEW_ARRIVALS_STATE_KEY = makeStateKey<Product[]>('home-new-arrivals');

/**
 * Maps column index → BANNER ownerId convention:
 *   column 0 (products)  → BANNER/10
 *   column 1 (community) → BANNER/11
 *   column 2 (story)     → BANNER/12
 */
const COLUMN_BANNER_IDS = [10, 11, 12];

@Injectable({ providedIn: 'root' })
export class HomeFacade implements OnDestroy {

  private readonly platformId      = inject(PLATFORM_ID);
  private readonly transferState   = inject(TransferState);
  private readonly productService  = inject(ProductService);
  private readonly preferences     = inject(PreferencesService);
  private readonly mediaService    = inject(MediaService);

  private readonly destroy$ = new Subject<void>();

  // ── Products state ────────────────────────────────────────────
  private readonly newArrivalsSubject         = new ReplaySubject<Product[]>(1);
  private readonly loadingNewArrivalsSubject  = new BehaviorSubject<boolean>(false);
  private readonly errorSubject               = new BehaviorSubject<string | null>(null);
  private readonly currencySubject            = new BehaviorSubject<string>(
    this.preferences.currentCurrency
  );

  readonly newArrivals$ = this.newArrivalsSubject.asObservable().pipe(
    distinctUntilChanged((a, b) =>
      a.length === b.length && a[0]?.id === b[0]?.id
    )
  );
  readonly loadingNewArrivals$ = this.loadingNewArrivalsSubject.asObservable();
  readonly error$              = this.errorSubject.asObservable();
  readonly currency$           = this.currencySubject.asObservable();

  private lastLoadedLang: string | null = null;
  private productsLoaded = false;

  // ── Static config ─────────────────────────────────────────────
  readonly logoPath = ASSET_PATHS.images.logo;

  get featuredProductsConfig() {
    return {
      scrollSpeed:    APP_CONSTANTS.featuredProducts.scrollSpeed,
      currencySymbol: this.currencySubject.getValue(),
      ctaHref:        APP_ROUTES.collections.all,
      ctaColorScheme: APP_CONSTANTS.featuredProducts.ctaColorScheme,
    };
  }

  // ── Columns (mutable — will be updated with backend URLs) ─────
  columns: ColumnItem[] = [
    {
      labelKey:       'home.threeColumnSection.products.label',
      ctaSubLabelKey: 'home.threeColumnSection.products.ctaSubLabel',
      ctaTextKey:     'home.threeColumnSection.products.ctaText',
      image:          ASSET_PATHS.images.productsSection,
      link:           APP_ROUTES.collections.all,
      isExternal:     false,
      size:           'large',
    },
    {
      labelKey:       'home.threeColumnSection.community.label',
      ctaSubLabelKey: 'home.threeColumnSection.community.ctaSubLabel',
      ctaTextKey:     'home.threeColumnSection.community.ctaText',
      image:          ASSET_PATHS.images.communitySection,
      link:           APP_CONSTANTS.externalLinks.instagram,
      isExternal:     true,
      size:           'small',
    },
    {
      labelKey:       'home.threeColumnSection.story.label',
      ctaSubLabelKey: 'home.threeColumnSection.story.ctaSubLabel',
      ctaTextKey:     'home.threeColumnSection.story.ctaText',
      image:          ASSET_PATHS.images.storySection,
      link:           APP_ROUTES.about,
      isExternal:     false,
      size:           'medium',
    },
  ];

  constructor() {
    this.subscribeToPreferences();
    this.loadColumnImages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Public API ────────────────────────────────────────────────

  loadProducts(): void {
    const currentLang = this.preferences.currentLang;

    if (this.loadingNewArrivalsSubject.getValue()) {
      return;
    }

    if (this.productsLoaded && this.lastLoadedLang === currentLang) {
      return;
    }

    this.productsLoaded  = true;
    this.lastLoadedLang  = currentLang;
    this.loadingNewArrivalsSubject.next(true);
    this.errorSubject.next(null);

    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(NEW_ARRIVALS_STATE_KEY)
    ) {
      const cached = this.transferState.get(NEW_ARRIVALS_STATE_KEY, []);
      this.transferState.remove(NEW_ARRIVALS_STATE_KEY);

      this.newArrivalsSubject.next(cached);
      this.loadingNewArrivalsSubject.next(false);
      return;
    }

    this.productService
      .getNewArrivals()
      .pipe(
        take(1),
        tap(products => {
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(NEW_ARRIVALS_STATE_KEY, products);
          }
        })
      )
      .subscribe({
        next: products => {
          this.newArrivalsSubject.next(products);
          this.loadingNewArrivalsSubject.next(false);
        },
        error: err => {
          console.error('[HomeFacade] Failed to load new arrivals:', err);
          this.errorSubject.next('home.errors.loadingProducts');
          this.newArrivalsSubject.next([]);
          this.loadingNewArrivalsSubject.next(false);
        },
      });
  }

  // ── Private ───────────────────────────────────────────────────

  /**
   * Fetch backend images for the three columns.
   * Each column maps to BANNER/{ownerId}.
   * If backend has an asset → override the image.
   * If not → keep the hardcoded fallback.
   */
  private loadColumnImages(): void {
    const requests = this.columns.map((column, index) =>
      this.mediaService.getAssetUrl(
        'BANNER',
        COLUMN_BANNER_IDS[index],
        column.image
      ).pipe(
        catchError(() => of(column.image))
      )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(urls => {
        this.columns = this.columns.map((column, index) => ({
          ...column,
          image: urls[index]
        }));
      });
  }

  private subscribeToPreferences(): void {
    this.preferences.currency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currency => {
        this.currencySubject.next(currency);
      });

    this.preferences.lang$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(lang => {
        if (this.productsLoaded && this.lastLoadedLang !== lang) {
          this.productsLoaded = false;
          this.loadProducts();
        }
      });
  }
}