import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FilterService } from '../../../core/services/filter.service';
import { ProductService } from '../../../core/services/product.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { SortValue } from '../../../shared/models/filter.model';
import { Product } from '../../../shared/models/product.model';
import { ProductFilterService } from '../services/product-filter.service';

@Injectable()
export class ProductListFacade implements OnDestroy {

  private readonly productService       = inject(ProductService);
  private readonly filterService        = inject(FilterService);
  private readonly productFilterService = inject(ProductFilterService);
  private readonly preferences          = inject(PreferencesService);
  private readonly productsSubject         = new BehaviorSubject<Product[]>([]);
  private readonly filteredProductsSubject = new BehaviorSubject<Product[]>([]);
  private readonly loadingSubject          = new BehaviorSubject<boolean>(false);
  private readonly errorSubject            = new BehaviorSubject<string | null>(null);
  private readonly selectedCategorySubject = new BehaviorSubject<string>('all');
  private readonly sortBySubject           = new BehaviorSubject<SortValue>('featured');
  private readonly searchQuerySubject      = new BehaviorSubject<string>('');
  private readonly currencySubject         = new BehaviorSubject<string>(
    this.preferences.currentCurrency
  );

  private readonly destroy$ = new Subject<void>();

  // ─── Public Observables ───────────────────────────────────────
  readonly filteredProducts$ = this.filteredProductsSubject.asObservable();
  readonly loading$          = this.loadingSubject.asObservable();
  readonly error$            = this.errorSubject.asObservable();
  readonly selectedCategory$ = this.selectedCategorySubject.asObservable();
  readonly sortBy$           = this.sortBySubject.asObservable();
  readonly searchQuery$      = this.searchQuerySubject.asObservable();
  readonly currency$         = this.currencySubject.asObservable();

  readonly lang$ = this.preferences.lang$;

  // ─── Lifecycle ────────────────────────────────────────────────
  initialize(): void {
    this.subscribeToCurrency();
    this.subscribeToLanguage();
    this.subscribeToFilters();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Private ─────────────────────────────────────────────────

  private subscribeToCurrency(): void {
    this.preferences.currency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currency => {
        this.currencySubject.next(currency);
      });
  }

  private subscribeToLanguage(): void {
    // When language changes, re-load products
    // (ProductService re-maps the cached DTOs for the new language)
    this.preferences.lang$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }

  private subscribeToFilters(): void {
    this.filterService.filterState$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filterState => {
        this.selectedCategorySubject.next(filterState.selectedCategory);
        this.sortBySubject.next(filterState.sortBy as SortValue);
        this.searchQuerySubject.next(filterState.searchQuery);
        this.applyFiltersAndSort();
      });
  }

  private loadProducts(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: products => {
          this.productsSubject.next(products);
          this.applyFiltersAndSort();
          this.loadingSubject.next(false);
        },
        error: err => {
          console.error('[ProductListFacade] Failed to load products:', err);
          this.errorSubject.next('products.list.errorLoading');
          this.productsSubject.next([]);
          this.applyFiltersAndSort();
          this.loadingSubject.next(false);
        },
      });
  }

  private applyFiltersAndSort(): void {
    const result = this.productFilterService.applyFiltersAndSort(
      this.productsSubject.getValue(),
      this.selectedCategorySubject.getValue(),
      this.searchQuerySubject.getValue(),
      this.sortBySubject.getValue()
    );
    this.filteredProductsSubject.next(result);
  }
}