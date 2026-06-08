// src/app/features/checkout/facade/checkout.facade.ts

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CheckoutFormService } from '../../../core/services/checkout-form.service';
import { CartService } from '../../../core/services/cart.service';
import {
  CheckoutFormData,
  CheckoutStatus,
  CheckoutResult,
} from '../../../core/models/checkout.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { AddressService } from '../../../core/services/address.service';

@Injectable()
export class CheckoutFacade implements OnDestroy {

  // ─── State ────────────────────────────────────────────────────
  private readonly isSubmittingSubject           = new BehaviorSubject<boolean>(false);
  private readonly isCalculatingShippingSubject  = new BehaviorSubject<boolean>(false);
  private readonly shippingCostSubject           = new BehaviorSubject<number>(50);
  private readonly statusSubject                 = new BehaviorSubject<CheckoutStatus>('idle');
  private readonly errorSubject                  = new BehaviorSubject<string | null>(null);
  private readonly resultSubject                 = new BehaviorSubject<CheckoutResult | null>(null);

  // ─── Public Observables ───────────────────────────────────────
  readonly isSubmitting$          = this.isSubmittingSubject.asObservable();
  readonly isCalculatingShipping$ = this.isCalculatingShippingSubject.asObservable();
  readonly shippingCost$          = this.shippingCostSubject.asObservable();
  readonly status$                = this.statusSubject.asObservable();
  readonly error$                 = this.errorSubject.asObservable();
  readonly result$                = this.resultSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly checkoutService:     CheckoutService,
    private readonly checkoutFormService: CheckoutFormService,
    private readonly cartService:         CartService,
    private readonly addressService:      AddressService,
    private readonly router:              Router,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Shipping Calculation ─────────────────────────────────────

  setupShippingCalculation(form: FormGroup): void {
    form.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      filter(() => this.checkoutFormService.isAddressComplete(form))
    ).subscribe(() => {
      this.calculateShipping(form);
    });
  }

  // ─── Form Submission ─────────────────────────────────────────

  submitForm(form: FormGroup): void {
    if (form.invalid) {
      this.checkoutFormService.markAllTouched(form);
      return;
    }

    if (this.isSubmittingSubject.getValue()) return;

    this.isSubmittingSubject.next(true);
    this.statusSubject.next('submitting');
    this.errorSubject.next(null);

    const formData: CheckoutFormData = form.value;
    const cart = this.cartService.getCart();

    this.checkoutService
      .submitOrder(formData, cart)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.resultSubject.next(result);
          this.statusSubject.next('success');
          this.isSubmittingSubject.next(false);
          this.cartService.clearCart();
          this.router.navigate([APP_ROUTES.orderConfirmation], {
            queryParams: { orderNumber: result.orderNumber }
          });
        },
        error: (err) => {
          console.error('[CheckoutFacade] Order submission failed:', err);
          this.statusSubject.next('error');
          this.errorSubject.next(
            'Failed to place order. Please try again.'
          );
          this.isSubmittingSubject.next(false);
        },
      });
  }

  // ─── Saved Addresses ─────────────────────────────────────────

  loadSavedAddresses(email: string): void {
    this.addressService
      .getByCustomerEmail(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) =>
          console.warn('[CheckoutFacade] Could not load saved addresses:', err)
      });
  }

  // ─── Helpers ─────────────────────────────────────────────────

  resetError(): void {
    this.errorSubject.next(null);
    this.statusSubject.next('idle');
  }

  getCurrentShippingCost(): number {
    return this.shippingCostSubject.value;
  }

  // ─── Private ─────────────────────────────────────────────────

  private calculateShipping(form: FormGroup): void {
    const addressData = this.checkoutFormService.getAddressSnapshot(form);
    this.isCalculatingShippingSubject.next(true);

    this.checkoutService
      .calculateShipping(addressData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (shippingCost) => {
          this.shippingCostSubject.next(shippingCost);
          this.isCalculatingShippingSubject.next(false);
        },
        error: () => {
          this.shippingCostSubject.next(50);
          this.isCalculatingShippingSubject.next(false);
        },
      });
  }
}