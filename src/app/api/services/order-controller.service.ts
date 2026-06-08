/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createOrder } from '../fn/order-controller/create-order';
import { CreateOrder$Params } from '../fn/order-controller/create-order';
import { getOrder } from '../fn/order-controller/get-order';
import { GetOrder$Params } from '../fn/order-controller/get-order';
import { getCustomerOrders } from '../fn/order-controller/get-customer-orders';
import { GetCustomerOrders$Params } from '../fn/order-controller/get-customer-orders';
import { updateOrderStatus } from '../fn/order-controller/update-order-status';
import { UpdateOrderStatus$Params } from '../fn/order-controller/update-order-status';
import { applyDiscountCode } from '../fn/order-controller/apply-discount-code';  
import { ApplyDiscountCode$Params } from '../fn/order-controller/apply-discount-code';  

import { OrderDto } from '../models/order-dto';
import { Order } from '../../core/models/order.model';
import { RawOrderEntity } from '../../core/mappers/order.mapper';

@Injectable({ providedIn: 'root' })
export class OrderControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── CREATE ORDER ────────────────────────────────────────────
  createOrder$Response(
    params: CreateOrder$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<OrderDto>> {
    return createOrder(this.http, this.rootUrl, params, context);
  }

  createOrder(
    params: CreateOrder$Params,
    context?: HttpContext
  ): Observable<OrderDto> {
    return this.createOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrderDto>): OrderDto => r.body)
    );
  }

  // ─── GET ORDER ───────────────────────────────────────────────
  getOrder$Response(
    params: GetOrder$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<OrderDto>> {
    return getOrder(this.http, this.rootUrl, params, context);
  }

  getOrder(
    params: GetOrder$Params,
    context?: HttpContext
  ): Observable<OrderDto> {
    return this.getOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrderDto>): OrderDto => r.body)
    );
  }

  // ─── GET CUSTOMER ORDERS ──────────────────────────────────────
  getCustomerOrders$Response(
    params: GetCustomerOrders$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<OrderDto>>> {
    return getCustomerOrders(this.http, this.rootUrl, params, context);
  }

  getCustomerOrders(
    params: GetCustomerOrders$Params,
    context?: HttpContext
  ): Observable<Array<OrderDto>> {
    return this.getCustomerOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderDto>>): Array<OrderDto> => r.body)
    );
  }

  // ─── UPDATE ORDER STATUS ──────────────────────────────────────
  updateOrderStatus$Response(
    params: UpdateOrderStatus$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<OrderDto>> {
    return updateOrderStatus(this.http, this.rootUrl, params, context);
  }

  updateOrderStatus(
    params: UpdateOrderStatus$Params,
    context?: HttpContext
  ): Observable<OrderDto> {
    return this.updateOrderStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrderDto>): OrderDto => r.body)
    );
  }

  // ─── APPLY DISCOUNT CODE ───────────────────────────────────
    applyDiscountCode$Response(
    params: ApplyDiscountCode$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RawOrderEntity>> {       
    return applyDiscountCode(this.http, this.rootUrl, params, context);
  }

  applyDiscountCode(
    params: ApplyDiscountCode$Params,
    context?: HttpContext
  ): Observable<RawOrderEntity> {                           
    return this.applyDiscountCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<RawOrderEntity>): RawOrderEntity => r.body)  
    );
  }
}