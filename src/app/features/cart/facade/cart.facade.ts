// src/app/features/cart/facade/cart.facade.ts

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  Cart,
  CartItem,
  CartCheckoutPayload,
} from '../../../core/models/cart.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { APP_CONFIG } from '../../../core/constants/app-config.constants';
import { CartService } from '../../../core/services/cart.service';
import { CartOrderMapper } from '../../../core/mappers/cart-order.mapper';
import { CartPageVm } from '../../../core/models/cart-page.model';
import { OrderService } from '../../../core/services/order.service';

@Injectable()
export class CartFacade implements OnDestroy {

  // ─── State (initialized in constructor) ───────────────────────
  readonly vm$!:       Observable<CartPageVm>;
  readonly cart$!:     Observable<Cart>;
  readonly cartOpen$!: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly cartService:     CartService,
    private readonly orderService:    OrderService,
    private readonly cartOrderMapper: CartOrderMapper,
    private readonly router:          Router,
  ) {
    // ─── Initialize observables AFTER dependencies are ready ────
    this.cart$     = this.cartService.cart$;
    this.cartOpen$ = this.cartService.cartOpen$;

    this.vm$ = this.cartService.cart$.pipe(
      map(cart => ({
        cart,
        isEmpty:        cart.items.length === 0,
        subtotal:       cart.subtotal,
        itemCount:      cart.itemCount,
        currencySymbol: APP_CONFIG.currency.symbol,
        hasDiscount:    (cart.discount ?? 0) > 0,
        hasTax:         (cart.tax ?? 0) > 0,
        hasShipping:    (cart.shipping ?? 0) > 0,
      }))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Cart Actions ─────────────────────────────────────────────

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  openCart(): void {
    this.cartService.openCart();
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  toggleCart(): void {
    this.cartService.toggleCart();
  }

  // ─── Checkout ─────────────────────────────────────────────────

  checkout(payload: CartCheckoutPayload): void {
    const cart       = this.cartService.getCart();
    const validation = this.cartOrderMapper.validateCart(cart);

    if (!validation.isValid) {
      console.warn(
        '[CartFacade] Cart validation failed:',
        validation.errors
      );
      return;
    }

    const orderPayload = this.cartOrderMapper.toCreateOrderPayload(
      cart,
      payload,
    );

    this.orderService
      .create(orderPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.cartService.clearCart();
          this.router.navigate([
            APP_ROUTES.checkout,
            { orderNumber: order.orderNumber },
          ]);
        },
        error: (err) => {
          console.error('[CartFacade] Failed to create order:', err);
        },
      });
  }

  // ─── Navigation ───────────────────────────────────────────────

  navigateToProducts(): void {
    this.router.navigate([APP_ROUTES.collections.all]);
  }

  navigateToCheckout(): void {
    this.router.navigate([APP_ROUTES.checkout]);
  }

  // ─── Helpers ─────────────────────────────────────────────────

  getCart(): Cart {
    return this.cartService.getCart();
  }

  isInCart(productId: string): boolean {
    return this.cartService
      .getCart()
      .items.some(i => i.productId === productId);
  }

  getItemQuantity(productId: string): number {
    return this.cartService
      .getCart()
      .items.find(i => i.productId === productId)
      ?.quantity ?? 0;
  }

  trackByItemId(_index: number, item: CartItem): string {
    return item.id;
  }
}