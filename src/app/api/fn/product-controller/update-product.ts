/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { ProductDto } from '../../models/product-dto';
import { UpdateProductRequest } from '../../models/update-product-request';

export interface UpdateProduct$Params {
  id: number;
  language?: string;
  body: UpdateProductRequest;
}

export function updateProduct(
  http: HttpClient,
  rootUrl: string,
  params: UpdateProduct$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<ProductDto>> {
  const rb = new RequestBuilder(rootUrl, updateProduct.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.query('language', params.language ?? 'en', {});
    rb.body(params.body, 'application/json');
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

updateProduct.PATH = '/api/products/{id}';