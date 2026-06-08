import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { Product } from '../../../shared/models/product.model';
import { CartItem } from '../../../core/models/cart.model';

@Injectable()
export class ProductDetailFacade implements OnDestroy {

  private readonly router         = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService    = inject(CartService);
  private readonly preferences    = inject(PreferencesService);

  // ─── State ────────────────────────────────────────────────────
  private readonly productSubject          = new BehaviorSubject<Product | null>(null);
  private readonly loadingSubject          = new BehaviorSubject<boolean>(true);
  private readonly errorSubject            = new BehaviorSubject<string | null>(null);
  private readonly addingToCartSubject     = new BehaviorSubject<boolean>(false);
  private readonly addToCartSuccessSubject = new BehaviorSubject<boolean>(false);
  private readonly selectSizeErrorSubject  = new BehaviorSubject<boolean>(false);
  private readonly currencySubject         = new BehaviorSubject<string>(
    this.preferences.currentCurrency
  );
  private readonly productIdSubject        = new BehaviorSubject<number | null>(null);

  readonly product$          = this.productSubject.asObservable();
  readonly loading$          = this.loadingSubject.asObservable();
  readonly error$            = this.errorSubject.asObservable();
  readonly addingToCart$     = this.addingToCartSubject.asObservable();
  readonly addToCartSuccess$ = this.addToCartSuccessSubject.asObservable();
  readonly selectSizeError$  = this.selectSizeErrorSubject.asObservable();
  readonly currency$         = this.currencySubject.asObservable();

  readonly lang$ = this.preferences.lang$;

  private readonly destroy$     = new Subject<void>();
  private successTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.subscribeToCurrency();
    this.subscribeToLanguageChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.successTimer);
  }

  // ─── Public API ───────────────────────────────────────────────

  loadProduct(id: number): void {
    this.productIdSubject.next(id);
    this.fetchProduct(id);
  }

  initializeSelection(product: Product): {
    selectedSize: string | null;
    selectedColor: string | null;
  } {
    return {
      selectedSize:  product.sizes?.[0]  ?? null,
      selectedColor: product.colors?.[0] ?? null,
    };
  }

  addToCart(
    product:       Product,
    quantity:      number,
    selectedSize:  string | null,
    selectedColor: string | null,
  ): boolean {
    if (product.sizes?.length && !selectedSize) {
      this.selectSizeErrorSubject.next(true);
      return false;
    }

    this.selectSizeErrorSubject.next(false);
    this.addingToCartSubject.next(true);
    this.addToCartSuccessSubject.next(false);

    const cartItem: CartItem = {
      id:        `${product.id}-${Date.now()}`,
      productId: product.id.toString(),
      name:      product.name,
      price:     product.price,
      quantity,
      image:     product.image,
      size:      selectedSize  ?? undefined,
      color:     selectedColor ?? undefined,
      sku:       product.sku   ?? '',
    };

    this.cartService.addItem(cartItem);
    this.addingToCartSubject.next(false);
    this.addToCartSuccessSubject.next(true);

    this.successTimer = setTimeout(() => {
      this.addToCartSuccessSubject.next(false);
    }, 3000);

    return true;
  }

  navigateToProducts(): void {
    this.router.navigate([APP_ROUTES.collections.all]);
  }

  navigateToCheckout(): void {
    this.router.navigate([APP_ROUTES.checkout]);
  }

  get currentCurrency(): string {
    return this.currencySubject.getValue();
  }

  // ─── Private ─────────────────────────────────────────────────

  private fetchProduct(id: number): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.productService
      .getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: product => {
          this.productSubject.next(product);
          this.loadingSubject.next(false);
        },
        error: err => {
          console.error('[ProductDetailFacade] Failed to load product:', err);
          this.errorSubject.next('products.detail.errorLoading');
          this.loadingSubject.next(false);
        },
      });
  }

  private subscribeToCurrency(): void {
    this.preferences.currency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currency => {
        this.currencySubject.next(currency);
      });
  }

  private subscribeToLanguageChange(): void {
    this.preferences.lang$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const currentId = this.productIdSubject.getValue();
        if (currentId !== null) {
          this.fetchProduct(currentId);
        }
      });
  }
}