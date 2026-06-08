// src/app/api/fn/media-controller/delete-asset-link.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface DeleteAssetLink$Params {
  assetLinkId: number;
}

export function deleteAssetLink(
  http: HttpClient,
  rootUrl: string,
  params: DeleteAssetLink$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {

  const rb = new RequestBuilder(rootUrl, deleteAssetLink.PATH, 'delete');

  if (params) {
    rb.path('assetLinkId', params.assetLinkId, {});
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<void>)
  );
}

deleteAssetLink.PATH = '/api/media/{assetLinkId}';