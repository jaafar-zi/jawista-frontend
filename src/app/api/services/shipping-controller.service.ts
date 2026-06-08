// src/app/api/services/shipping-controller.service.ts

/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createShipping } from '../fn/shipping-controller/create-shipping';
import { CreateShipping$Params } from '../fn/shipping-controller/create-shipping';
import { trackShipping } from '../fn/shipping-controller/track-shipping';
import { TrackShipping$Params } from '../fn/shipping-controller/track-shipping';
import { updateShipping } from '../fn/shipping-controller/update-shipping';
import { UpdateShipping$Params } from '../fn/shipping-controller/update-shipping';
import { updateShippingStatus } from '../fn/shipping-controller/update-shipping-status';
import { UpdateShippingStatus$Params } from '../fn/shipping-controller/update-shipping-status';
import { getShippingsByStatus } from '../fn/shipping-controller/get-shippings-by-status';
import { GetShippingsByStatus$Params } from '../fn/shipping-controller/get-shippings-by-status';
import { getShippingByOrder } from '../fn/shipping-controller/get-shipping-by-order';
import { GetShippingByOrder$Params } from '../fn/shipping-controller/get-shipping-by-order';
import { getCustomerShippings } from '../fn/shipping-controller/get-customer-shippings';
import { GetCustomerShippings$Params } from '../fn/shipping-controller/get-customer-shippings';

import { ShippingDto } from '../models/shipping-dto';

@Injectable({ providedIn: 'root' })
export class ShippingControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── TRACK SHIPPING ────────────────────────────────────────
  trackShipping$Response(
    params: TrackShipping$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ShippingDto>> {
    return trackShipping(this.http, this.rootUrl, params, context);
  }

  trackShipping(
    params: TrackShipping$Params,
    context?: HttpContext
  ): Observable<ShippingDto> {
    return this.trackShipping$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShippingDto>): ShippingDto => r.body)
    );
  }

  // ─── GET SHIPPING BY ORDER ─────────────────────────────────
  getShippingByOrder$Response(
    params: GetShippingByOrder$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ShippingDto>> {
    return getShippingByOrder(this.http, this.rootUrl, params, context);
  }

  getShippingByOrder(
    params: GetShippingByOrder$Params,
    context?: HttpContext
  ): Observable<ShippingDto> {
    return this.getShippingByOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShippingDto>): ShippingDto => r.body)
    );
  }

  // ─── GET CUSTOMER SHIPPINGS ────────────────────────────────
  getCustomerShippings$Response(
    params: GetCustomerShippings$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<ShippingDto>>> {
    return getCustomerShippings(this.http, this.rootUrl, params, context);
  }

  getCustomerShippings(
    params: GetCustomerShippings$Params,
    context?: HttpContext
  ): Observable<Array<ShippingDto>> {
    return this.getCustomerShippings$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ShippingDto>>): Array<ShippingDto> => r.body)
    );
  }

  // ─── GET SHIPPINGS BY STATUS ───────────────────────────────
  getShippingsByStatus$Response(
    params: GetShippingsByStatus$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<ShippingDto>>> {
    return getShippingsByStatus(this.http, this.rootUrl, params, context);
  }

  getShippingsByStatus(
    params: GetShippingsByStatus$Params,
    context?: HttpContext
  ): Observable<Array<ShippingDto>> {
    return this.getShippingsByStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ShippingDto>>): Array<ShippingDto> => r.body)
    );
  }

  // ─── CREATE SHIPPING ──────────────────────────────────────
  createShipping$Response(
    params: CreateShipping$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ShippingDto>> {
    return createShipping(this.http, this.rootUrl, params, context);
  }

  createShipping(
    params: CreateShipping$Params,
    context?: HttpContext
  ): Observable<ShippingDto> {
    return this.createShipping$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShippingDto>): ShippingDto => r.body)
    );
  }

  // ─── UPDATE SHIPPING ──────────────────────────────────────
  updateShipping$Response(
    params: UpdateShipping$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ShippingDto>> {
    return updateShipping(this.http, this.rootUrl, params, context);
  }

  updateShipping(
    params: UpdateShipping$Params,
    context?: HttpContext
  ): Observable<ShippingDto> {
    return this.updateShipping$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShippingDto>): ShippingDto => r.body)
    );
  }

  // ─── UPDATE SHIPPING STATUS ────────────────────────────────
  updateShippingStatus$Response(
    params: UpdateShippingStatus$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ShippingDto>> {
    return updateShippingStatus(this.http, this.rootUrl, params, context);
  }

  updateShippingStatus(
    params: UpdateShippingStatus$Params,
    context?: HttpContext
  ): Observable<ShippingDto> {
    return this.updateShippingStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShippingDto>): ShippingDto => r.body)
    );
  }
}