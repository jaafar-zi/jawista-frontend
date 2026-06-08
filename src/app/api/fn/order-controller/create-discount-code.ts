import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { DiscountCode } from '../../../core/models/order.model';
import { CreateDiscountCodeRequest } from '../../models/create-discount-code-request';

export interface CreateDiscountCode$Params {
  body: CreateDiscountCodeRequest;
}

export function createDiscountCode(
  http: HttpClient,
  rootUrl: string,
  params: CreateDiscountCode$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<DiscountCode>> {
  const rb = new RequestBuilder(
    rootUrl,
    createDiscountCode.PATH,
    'post'
  );

  rb.body(params.body, 'application/json');

  return http
    .request(rb.build({ responseType: 'json', accept: '*/*', context }))
    .pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<DiscountCode>)
    );
}

createDiscountCode.PATH = '/api/admin/discount-codes';