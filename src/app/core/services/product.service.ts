import {
  Injectable,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Observable,
  of,
  BehaviorSubject,
  switchMap,
  catchError,
  map,
  tap,
  shareReplay,
} from 'rxjs';
import { ProductControllerService } from '../../api/services/product-controller.service';
import { PreferencesService } from './preferences.service';
import { FilterState } from '../../shared/models/filter.model';
import { Product, ProductDetail } from '../../shared/models/product.model';
import { PRODUCT_LIMITS } from '../constants/product.constants';
import { ProductMapper } from '../mappers/product.mapper';

const ALL_PRODUCTS_KEY    = makeStateKey<any[]>('all-products');
const ACTIVE_PRODUCTS_KEY = makeStateKey<any[]>('active-products');

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly platformId    = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);
  private readonly api           = inject(ProductControllerService);
  private readonly mapper        = inject(ProductMapper);
  private readonly preferences   = inject(PreferencesService);

  // ── Raw DTO cache (fetched once, re-mapped per language) ──────
  private readonly allDtos$: Observable<any[]> =
    this.fetchWithCache(false, ALL_PRODUCTS_KEY).pipe(
      shareReplay(1)
    );

  private readonly activeDtos$: Observable<any[]> =
    this.fetchWithCache(true, ACTIVE_PRODUCTS_KEY).pipe(
      shareReplay(1)
    );

  // ── Language-aware mapped streams ─────────────────────────────
  // These re-map whenever the language changes, without re-fetching.

  private readonly allProductsMapped$: Observable<Product[]> =
    this.preferences.lang$.pipe(
      switchMap(lang =>
        this.allDtos$.pipe(
          map(dtos => this.mapper.toProductList(dtos, lang))
        )
      ),
      shareReplay(1)
    );

  private readonly activeProductsMapped$: Observable<Product[]> =
    this.preferences.lang$.pipe(
      switchMap(lang =>
        this.activeDtos$.pipe(
          map(dtos => this.mapper.toProductList(dtos, lang))
        )
      ),
      shareReplay(1)
    );

  // ── Public API ────────────────────────────────────────────────

  getProducts(filters?: FilterState): Observable<Product[]> {
    return this.allProductsMapped$.pipe(
      map(products => this.applyFilters(products, filters)),
      catchError(error => {
        console.error('[ProductService] Failed to get products:', error);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.preferences.lang$.pipe(
      switchMap(lang =>
        this.api.getProductById({ id }).pipe(
          map(dto => this.mapper.toProduct(dto, lang)),
          catchError(error => {
            console.error(
              `[ProductService] Failed to get product #${id}:`,
              error
            );
            return of(null);
          })
        )
      )
    );
  }

  getProductDetailById(id: number): Observable<ProductDetail | null> {
    return this.preferences.lang$.pipe(
      switchMap(lang =>
        this.api.getProductById({ id }).pipe(
          map(dto => this.mapper.toProductDetail(dto, lang)),
          catchError(error => {
            console.error(
              `[ProductService] Failed to get product detail #${id}:`,
              error
            );
            return of(null);
          })
        )
      )
    );
  }

  getFeaturedProducts(limit = PRODUCT_LIMITS.featured): Observable<Product[]> {
    return this.activeProductsMapped$.pipe(
      map(products => products.slice(0, limit)),
      catchError(error => {
        console.error('[ProductService] Failed to get featured products:', error);
        return of([]);
      })
    );
  }

  getNewArrivals(limit = PRODUCT_LIMITS.newArrivals): Observable<Product[]> {
    return this.activeProductsMapped$.pipe(
      map(products => products.slice(0, limit)),
      catchError(error => {
        console.error('[ProductService] Failed to get new arrivals:', error);
        return of([]);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.allProductsMapped$.pipe(
      map(products => products.filter(p => p.category === category)),
      catchError(error => {
        console.error(
          `[ProductService] Failed to get products by category '${category}':`,
          error
        );
        return of([]);
      })
    );
  }

  getProductBySku(sku: string): Observable<Product | null> {
    return this.preferences.lang$.pipe(
      switchMap(lang =>
        this.api.getProductBySku({ sku }).pipe(
          map(dto => this.mapper.toProduct(dto, lang)),
          catchError(error => {
            console.error(
              `[ProductService] Failed to get product by SKU '${sku}':`,
              error
            );
            return of(null);
          })
        )
      )
    );
  }

  getRelatedProducts(
    productId: number,
    limit = PRODUCT_LIMITS.related,
  ): Observable<Product[]> {
    return this.activeProductsMapped$.pipe(
      map(products =>
        products.filter(p => p.id !== productId).slice(0, limit)
      ),
      catchError(error => {
        console.error(
          `[ProductService] Failed to get related products for #${productId}:`,
          error
        );
        return of([]);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const lower = query.toLowerCase();
    return this.allProductsMapped$.pipe(
      map(products =>
        products.filter(
          p =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower)
        )
      ),
      catchError(error => {
        console.error('[ProductService] Failed to search products:', error);
        return of([]);
      })
    );
  }

  // ── Private Helpers ───────────────────────────────────────────

  private fetchWithCache(
    activeOnly: boolean,
    key: ReturnType<typeof makeStateKey<any[]>>,
  ): Observable<any[]> {
    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(key)) {
        const cached = this.transferState.get(key, []);
        this.transferState.remove(key);
        return of(cached);
      }
    }

    return this.api.getAllProducts({ activeOnly }).pipe(
      tap(raw => {
        if (!isPlatformBrowser(this.platformId)) {
          this.transferState.set(key, raw);
        }
      }),
      catchError(() => of([])),
    );
  }

  private applyFilters(
    products: Product[],
    filters?: FilterState
  ): Product[] {
    if (!filters?.selectedCategory || filters.selectedCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === filters.selectedCategory);
  }
}