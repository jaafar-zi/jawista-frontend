// src/app/api/fn/order-controller/apply-discount-code.ts

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { RawOrderEntity } from '../../../core/mappers/order.mapper';  
import { ApplyDiscountCodeRequest } from '../../models/apply-discount-code';

export interface ApplyDiscountCode$Params {
  orderId: number;
  body: ApplyDiscountCodeRequest;
}

export function applyDiscountCode(
  http: HttpClient,
  rootUrl: string,
  params: ApplyDiscountCode$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<RawOrderEntity>> {         
  const rb = new RequestBuilder(
    rootUrl,
    applyDiscountCode.PATH,
    'post'
  );

  rb.path('orderId', params.orderId, {});
  rb.body(params.body, 'application/json');

  return http
    .request(rb.build({ responseType: 'json', accept: '*/*', context }))
    .pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<RawOrderEntity>)  
    );
}

applyDiscountCode.PATH = '/api/orders/{orderId}/apply-discount';