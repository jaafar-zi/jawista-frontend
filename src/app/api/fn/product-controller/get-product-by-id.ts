/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { ProductDto } from '../../models/product-dto';

export interface GetProductById$Params {
  id: number;
  language?: string;
}

export function getProductById(
  http: HttpClient,
  rootUrl: string,
  params: GetProductById$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<ProductDto>> {
  const rb = new RequestBuilder(rootUrl, getProductById.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
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

getProductById.PATH = '/api/products/{id}';