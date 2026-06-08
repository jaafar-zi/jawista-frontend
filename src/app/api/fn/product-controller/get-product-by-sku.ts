/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { ProductDto } from '../../models/product-dto';

export interface GetProductBySku$Params {
  sku: string;
  language?: string;
}

export function getProductBySku(
  http: HttpClient,
  rootUrl: string,
  params: GetProductBySku$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<ProductDto>> {
  const rb = new RequestBuilder(rootUrl, getProductBySku.PATH, 'get');
  if (params) {
    rb.path('sku', params.sku, {});
    rb.query('language', params.language ?? 'en', {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ProductDto>;
    })
  );
}

getProductBySku.PATH = '/api/products/sku/{sku}';