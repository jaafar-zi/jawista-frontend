/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { DiscountCode } from '../../models/discount-code';

export interface ValidateDiscountCode$Params {
  code: string;
}

export function validateDiscountCode(
  http: HttpClient,
  rootUrl: string,
  params: ValidateDiscountCode$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<DiscountCode>> {
  const rb = new RequestBuilder(
    rootUrl,
    validateDiscountCode.PATH,
    'get'
  );

  rb.query('code', params.code, {});

  return http
    .request(rb.build({
      responseType: 'json',
      accept: '*/*',
      context,
    }))
    .pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<DiscountCode>)
    );
}

validateDiscountCode.PATH = '/api/discount-codes/validate';