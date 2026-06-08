/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { DiscountCode } from '../models/discount-code';
import { RawOrderEntity } from '../../core/mappers/order.mapper';

import {
  CreateDiscountCode$Params,
  createDiscountCode,
} from '../fn/order-controller/create-discount-code';
import {
  ApplyDiscountCode$Params,
  applyDiscountCode,
} from '../fn/order-controller/apply-discount-code';
import { ValidateDiscountCode$Params, validateDiscountCode } from '../fn/order-controller/validate-discount-code';

@Injectable({ providedIn: 'root' })
export class DiscountCodeControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── CREATE ────────────────────────────────────────────────────

  createDiscountCode$Response(
    params: CreateDiscountCode$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<DiscountCode>> {
    return createDiscountCode(this.http, this.rootUrl, params, context);
  }

  createDiscountCode(
    params: CreateDiscountCode$Params,
    context?: HttpContext
  ): Observable<DiscountCode> {
    return this.createDiscountCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<DiscountCode>): DiscountCode => r.body)
    );
  }

  // ─── VALIDATE ──────────────────────────────────────────────────

  validateDiscountCode$Response(
    params: ValidateDiscountCode$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<DiscountCode>> {
    return validateDiscountCode(this.http, this.rootUrl, params, context);
  }

  validateDiscountCode(
    params: ValidateDiscountCode$Params,
    context?: HttpContext
  ): Observable<DiscountCode> {
    return this.validateDiscountCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<DiscountCode>): DiscountCode => r.body)
    );
  }

  // ─── APPLY ─────────────────────────────────────────────────────

  applyDiscount$Response(
    params: ApplyDiscountCode$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RawOrderEntity>> {
    return applyDiscountCode(this.http, this.rootUrl, params, context);
  }

  applyDiscount(
    params: ApplyDiscountCode$Params,
    context?: HttpContext
  ): Observable<RawOrderEntity> {
    return this.applyDiscount$Response(params, context).pipe(
      map((r: StrictHttpResponse<RawOrderEntity>): RawOrderEntity => r.body)
    );
  }
}