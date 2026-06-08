import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { OrderControllerService } from '../../api/services/order-controller.service';
import { DiscountCodeControllerService } from '../../api/services/discount-code-controller.service';
import { OrderMapper } from '../mappers/order.mapper';
import {
  Order,
  OrderStatus,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  ORDER_STATUS_CONFIG,
  ApplyDiscountCodePayload,
  CreateDiscountCodePayload,
  DiscountCode,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  // ─── Dependencies ──────────────────────────────────────────────
  private readonly api         = inject(OrderControllerService);
  private readonly discountApi = inject(DiscountCodeControllerService);
  private readonly mapper      = inject(OrderMapper);

  // ─── State ─────────────────────────────────────────────────────
  private readonly _orders        = signal<Order[]>([]);
  private readonly _selected      = signal<Order | null>(null);
  private readonly _loading       = signal(false);
  private readonly _error         = signal<string | null>(null);
  private readonly _discountCodes = signal<DiscountCode[]>([]);

  // ─── Public Readonly State ─────────────────────────────────────
  readonly orders        = this._orders.asReadonly();
  readonly selected      = this._selected.asReadonly();
  readonly loading       = this._loading.asReadonly();
  readonly error         = this._error.asReadonly();
  readonly discountCodes = this._discountCodes.asReadonly();

  // ─── Computed ──────────────────────────────────────────────────
  readonly pendingOrders = computed(() =>
    this._orders().filter(o => o.status === 'PENDING')
  );

  readonly activeOrders = computed(() =>
    this._orders().filter(o =>
      !['DELIVERED', 'CANCELLED'].includes(o.status)
    )
  );

  readonly deliveredOrders = computed(() =>
    this._orders().filter(o => o.status === 'DELIVERED')
  );

  readonly cancelledOrders = computed(() =>
    this._orders().filter(o => o.status === 'CANCELLED')
  );

  readonly totalOrders = computed(() =>
    this._orders().length
  );

  readonly totalRevenue = computed(() =>
    this._orders()
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0)
  );

  readonly ordersByStatus = computed(() =>
    Object.keys(ORDER_STATUS_CONFIG).reduce((acc, status) => {
      acc[status as OrderStatus] = this._orders().filter(
        o => o.status === status
      );
      return acc;
    }, {} as Record<OrderStatus, Order[]>)
  );

  readonly discountedOrders = computed(() =>
    this._orders().filter(o => !!o.appliedDiscountCode)
  );

  readonly totalDiscountSavings = computed(() =>
    this._orders().reduce((sum, o) => sum + (o.discountAmount ?? 0), 0)
  );

  // ─── Order Methods ─────────────────────────────────────────────

  create(payload: CreateOrderPayload): Observable<Order> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.createOrder({ body: this.mapper.toCreateDto(payload) }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(order => {
        this._orders.update(orders => [order, ...orders]);
        this._selected.set(order);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError('Failed to create order', err)
      )
    );
  }

  getByOrderNumber(orderNumber: string): Observable<Order> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getOrder({ orderNumber }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(order => {
        this._selected.set(order);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to load order #${orderNumber}`, err)
      )
    );
  }

  getByCustomerEmail(email: string): Observable<Order[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.getCustomerOrders({ email }).pipe(
      map(dtos => this.mapper.fromDtoList(dtos)),
      tap(orders => {
        this._orders.set(orders);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(`Failed to load orders for ${email}`, err)
      )
    );
  }

  updateStatus(payload: UpdateOrderStatusPayload): Observable<Order> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.updateOrderStatus({
      orderNumber: payload.orderNumber,
      status:      payload.status,
    }).pipe(
      map(dto => this.mapper.fromDto(dto)),
      tap(updated => {
        this._replaceOrder(updated);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(
          `Failed to update status for order #${payload.orderNumber}`,
          err
        )
      )
    );
  }

  // ─── Discount Methods ──────────────────────────────────────────
  applyDiscount(
  orderId: number,
  payload: ApplyDiscountCodePayload
  ): Observable<Order> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.applyDiscountCode({
      orderId,
      body: { code: payload.code },
    }).pipe(
      map(entity => this.mapper.fromEntity(entity)),  
      tap(updated => {
        this._replaceOrder(updated);
        this._selected.set(updated);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError(
          `Failed to apply discount code "${payload.code}"`,
          err
        )
      )
    );
  }

  createDiscountCode(
    payload: CreateDiscountCodePayload
  ): Observable<DiscountCode> {
    this._loading.set(true);
    this._error.set(null);

    return this.discountApi.createDiscountCode({ body: payload }).pipe(
      tap(code => {
        this._discountCodes.update(codes => [code, ...codes]);
        this._loading.set(false);
      }),
      catchError(err =>
        this.handleError('Failed to create discount code', err)
      )
    );
  }

  // ─── Convenience Status Updates ────────────────────────────────

  cancelOrder(orderNumber: number): Observable<Order> {
    return this.updateStatus({ orderNumber, status: 'CANCELLED' });
  }

  confirmOrder(orderNumber: number): Observable<Order> {
    return this.updateStatus({ orderNumber, status: 'CONFIRMED' });
  }

  // ─── Local State Helpers ───────────────────────────────────────

  selectOrder(order: Order | null): void {
    this._selected.set(order);
  }

  clearOrders(): void {
    this._orders.set([]);
    this._selected.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }

  findByOrderNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.orderNumber === orderNumber);
  }

  filterByStatus(status: OrderStatus): Order[] {
    return this._orders().filter(o => o.status === status);
  }

  // ─── Private ──────────────────────────────────────────────────

  private _replaceOrder(updated: Order): void {
    this._orders.update(orders =>
      orders.map(o =>
        o.orderNumber === updated.orderNumber ? updated : o
      )
    );
    if (this._selected()?.orderNumber === updated.orderNumber) {
      this._selected.set(updated);
    }
  }

  private handleError(message: string, err: unknown): Observable<never> {
    this._error.set(message);
    this._loading.set(false);
    console.error(`[OrderService] ${message}:`, err);
    return throwError(() => err);
  }
}