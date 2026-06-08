import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Cart, CartCheckoutPayload } from '../models/cart.model';
import {
  CheckoutFormData,
  CheckoutSummary,
  CheckoutResult,
} from '../models/checkout.model';
import {
  DiscountCode,
} from '../models/order.model';
import { OrderService } from './order.service';
import { DiscountCodeControllerService } from '../../api/services/discount-code-controller.service';
import { CartOrderMapper } from '../mappers/cart-order.mapper';

export type DiscountPhase = 'idle' | 'validating' | 'valid' | 'failed';

export interface DiscountState {
  phase: DiscountPhase;
  code: string | null;
  error: string | null;
  discount: DiscountCode | null;
}

const IDLE_STATE: DiscountState = {
  phase: 'idle',
  code: null,
  error: null,
  discount: null,
};

@Injectable({ providedIn: 'root' })
export class CheckoutService {

  private readonly orderService    = inject(OrderService);
  private readonly discountApi     = inject(DiscountCodeControllerService);
  private readonly cartOrderMapper = inject(CartOrderMapper);

  private readonly _discountState = new BehaviorSubject<DiscountState>(IDLE_STATE);
  readonly discountState$ = this._discountState.asObservable();

  readonly discount$ = this._discountState.pipe(
    map(state => state.discount)
  );

  // ─── Discount ──────────────────────────────────────────────────

  validateDiscountCode(code: string): Observable<DiscountCode> {
    const trimmed = code.trim().toUpperCase();

    this._discountState.next({
      phase: 'validating',
      code: trimmed,
      error: null,
      discount: null,
    });

    return this.discountApi.validateDiscountCode({ code: trimmed }).pipe(
      tap(discount => {
        this._discountState.next({
          phase: 'valid',
          code: trimmed,
          error: null,
          discount,
        });
      }),
      catchError(err => {
        const message = this.extractErrorMessage(err);
        this._discountState.next({
          phase: 'failed',
          code: trimmed,
          error: message,
          discount: null,
        });
        return throwError(() => new Error(message));
      })
    );
  }

  removeDiscountCode(): void {
    this._discountState.next(IDLE_STATE);
  }

  getCurrentDiscount(): DiscountCode | null {
    return this._discountState.value.discount;
  }

  getPendingCode(): string | null {
    const state = this._discountState.value;
    return state.phase === 'valid' ? state.code : null;
  }

  // ─── Order Submission ──────────────────────────────────────────

  submitOrder(
    formData: CheckoutFormData,
    cart: Cart,
    shippingCost: number = 8
  ): Observable<CheckoutResult> {

    const validation = this.cartOrderMapper.validateCart(cart);
    if (!validation.isValid) {
      return new Observable(observer => {
        observer.error(new Error(validation.errors.join(', ')));
      });
    }

    const shippingAddress = this.buildShippingAddress(formData);

    const checkoutPayload: CartCheckoutPayload = {
      customerPhone:   formData.phone,
      customerEmail:   formData.email || undefined,
      customerName:    formData.name,
      shippingAddress,
      billingAddress:  shippingAddress,
      currency:        cart.currency ?? 'TND',
      shippingCost,
    };

    const orderPayload = this.cartOrderMapper.toCreateOrderPayload(
      cart,
      checkoutPayload
    );

    const discountState = this._discountState.value;
    const validatedCode = discountState.phase === 'valid'
      ? discountState.code
      : null;

    return this.orderService.create(orderPayload).pipe(
      switchMap(order => {
        if (validatedCode && order.id) {
          return this.orderService
            .applyDiscount(Number(order.id), { code: validatedCode })
            .pipe(
              map(discountedOrder =>
                this.toCheckoutResult(discountedOrder as any, true)
              ),
              catchError(() => {
                console.warn(
                  '[CheckoutService] Discount application failed post-creation'
                );
                return of(this.toCheckoutResult(order as any, false));
              })
            );
        }
        return of(this.toCheckoutResult(order as any, false));
      }),
      tap(() => {
        this._discountState.next(IDLE_STATE);
      }),
      catchError(err => {
        console.error('[CheckoutService] Order submission failed:', err);
        throw err;
      })
    );
  }

  // ─── Summary Calculation ───────────────────────────────────────

  calculateSummary(
    subtotal: number,
    shippingCost: number = 8
  ): CheckoutSummary {
    const state = this._discountState.value;

    let discountAmount = 0;
    let discountType: 'FIXED' | 'PERCENTAGE' | undefined;
    let appliedDiscountCode: string | undefined;

    if (state.phase === 'valid' && state.discount?.discountValue) {
      const discount = state.discount;
      discountType = discount.discountType;
      appliedDiscountCode = discount.code;

      if (
        discount.minimumOrderAmount &&
        subtotal < discount.minimumOrderAmount
      ) {
        discountAmount = 0;
      } else if (discount.discountType === 'PERCENTAGE' && discount.discountValue) {
        discountAmount = subtotal * (discount.discountValue / 100);
      } else if (discount.discountValue){
        discountAmount = discount.discountValue;
      }

      discountAmount = Math.min(discountAmount, subtotal);
    }

    const tax = 0;
    const total = Math.max(0, subtotal + shippingCost + tax - discountAmount);

    return {
      subtotal,
      shipping: shippingCost,
      tax,
      discount: discountAmount,
      total,
      appliedDiscountCode,
      discountType,
    };
  }

  // ─── Private ──────────────────────────────────────────────────

  private buildShippingAddress(formData: CheckoutFormData): string {
    return [
      formData.address,
      formData.city,
      formData.province,
    ].filter(Boolean).join(', ');
  }

  private toCheckoutResult(
    order: { id: number; orderNumber: string; total: number; currency: string },
    discountApplied: boolean
  ): CheckoutResult {
    return {
      orderId: order.id.toString(),
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      discountApplied,
    };
  }

  private extractErrorMessage(err: any): string {
    if (err?.error?.message) return err.error.message;
    if (err?.error?.error) return err.error.error;
    if (err?.status === 404) return 'Discount code not found.';
    if (err?.status === 400) return 'Discount code is invalid or expired.';
    if (err?.status === 409) return 'Discount code is no longer available.';
    return 'Failed to validate discount code.';
  }
}