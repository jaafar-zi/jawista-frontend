/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { ProductDto } from '../../models/product-dto';

export interface GetAllProducts$Params {
  activeOnly?: boolean;
  language?: string;
}

export function getAllProducts(
  http: HttpClient,
  rootUrl: string,
  params?: GetAllProducts$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<ProductDto>>> {
  const rb = new RequestBuilder(rootUrl, getAllProducts.PATH, 'get');
  if (params) {
    rb.query('activeOnly', params.activeOnly ?? true, {});
    rb.query('language', params.language ?? 'en', {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ProductDto>>;
    })
  );
}

getAllProducts.PATH = '/api/products';