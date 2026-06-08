// src/app/api/services/subscriber-controller.service.ts

/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getAllActiveSubscribers } from '../fn/subscriber-controller/get-all-active-subscribers';
import { GetAllActiveSubscribers$Params } from '../fn/subscriber-controller/get-all-active-subscribers';
import { subscribe } from '../fn/subscriber-controller/subscribe';
import { Subscribe$Params } from '../fn/subscriber-controller/subscribe';
import { unsubscribe } from '../fn/subscriber-controller/unsubscribe';
import { Unsubscribe$Params } from '../fn/subscriber-controller/unsubscribe';

import { SubscriberDto } from '../models/subscriber-dto';

@Injectable({ providedIn: 'root' })
export class SubscriberControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── GET ALL ACTIVE SUBSCRIBERS ────────────────────────────
  getAllActiveSubscribers$Response(
    params?: GetAllActiveSubscribers$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<SubscriberDto>>> {
    return getAllActiveSubscribers(this.http, this.rootUrl, params, context);
  }

  getAllActiveSubscribers(
    params?: GetAllActiveSubscribers$Params,
    context?: HttpContext
  ): Observable<Array<SubscriberDto>> {
    return this.getAllActiveSubscribers$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SubscriberDto>>): Array<SubscriberDto> => r.body)
    );
  }

  // ─── SUBSCRIBE ─────────────────────────────────────────────
  subscribe$Response(
    params: Subscribe$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SubscriberDto>> {
    return subscribe(this.http, this.rootUrl, params, context);
  }

  subscribe(
    params: Subscribe$Params,
    context?: HttpContext
  ): Observable<SubscriberDto> {
    return this.subscribe$Response(params, context).pipe(
      map((r: StrictHttpResponse<SubscriberDto>): SubscriberDto => r.body)
    );
  }

  // ─── UNSUBSCRIBE ──────────────────────────────────────────
  unsubscribe$Response(
    params: Unsubscribe$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return unsubscribe(this.http, this.rootUrl, params, context);
  }

  unsubscribe(
    params: Unsubscribe$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.unsubscribe$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}