// src/app/features/checkout/pages/checkout-page/checkout-page.component.ts

import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { CartService } from '../../../../core/services/cart.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { ToastService } from '../../../../layout/services/toaster.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Cart } from '../../../../core/models/cart.model';
import { CheckoutSummary, CheckoutFormData } from '../../../../core/models/checkout.model';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-checkout-page',
  standalone: false,
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  cart: Cart = {
    items: [], subtotal: 0,
    total: 0, itemCount: 0, currency: 'TND',
  };

  checkoutSummary: CheckoutSummary = {
    subtotal: 0, shipping: 8,
    tax: 0, discount: 0, total: 0,
  };

  isSubmitting = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly cartService:     CartService,
    private readonly checkoutService: CheckoutService,
    private readonly toastService:    ToastService,
    private readonly router:          Router,
    private readonly cdr:             ChangeDetectorRef,
    private readonly seo:             SeoService,
  ) {}

  ngOnInit(): void {
    this.seo.updateMetaFromKeys({
      titleKey:       'seo.checkout.title',
      descriptionKey: 'seo.checkout.description',
      noIndex:        true,
    });

    this.guardEmptyCart();
    this.loadCartAndSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFormSubmit(formData: CheckoutFormData): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;
    this.cdr.markForCheck();

    this.checkoutService
      .submitOrder(formData, this.cart, this.checkoutSummary.shipping)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.isSubmitting = false;
          this.cartService.clearCart();
          const discountMsg = result.discountApplied ? ' Discount applied!' : '';
          this.toastService.success(
            `Order #${result.orderNumber} placed successfully!${discountMsg}`
          );
          this.router.navigate([APP_ROUTES.home]);
        },
        error: err => {
          console.error('[CheckoutPage] Order failed:', err);
          this.isSubmitting = false;
          this.error = 'Failed to place your order. Please try again.';
          this.toastService.error(this.error);
          this.cdr.markForCheck();
        },
      });
  }

  onShippingCalculated(shippingCost: number): void {
    this.checkoutSummary = this.checkoutService.calculateSummary(
      this.cart.subtotal, shippingCost
    );
    this.cdr.markForCheck();
  }

  onDiscountApplied(code: string): void {
    this.checkoutService
      .validateDiscountCode(code)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => { this.recalculateSummary(); this.toastService.success('Discount code applied!'); },
        error: () => { this.recalculateSummary(); },
      });
  }

  onDiscountRemoved(): void {
    this.checkoutService.removeDiscountCode();
    this.recalculateSummary();
  }

  private recalculateSummary(): void {
    this.checkoutSummary = this.checkoutService.calculateSummary(
      this.cart.subtotal, this.checkoutSummary.shipping
    );
    this.cdr.markForCheck();
  }

  private loadCartAndSummary(): void {
    combineLatest([this.cartService.cart$, this.checkoutService.discount$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cart]) => {
        this.cart = cart;
        this.recalculateSummary();
      });
  }

  private guardEmptyCart(): void {
    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      this.router.navigate([APP_ROUTES.cart]);
    }
  }
}