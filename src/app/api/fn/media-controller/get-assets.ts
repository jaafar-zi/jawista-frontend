// src/app/api/fn/media-controller/get-assets.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { AssetResponse } from '../../models/asset-response';
import { AssetOwnerType } from '../../models/asset-owner-type';

export interface GetAssets$Params {
  ownerType: AssetOwnerType;
  ownerId: number;
}

export function getAssets(
  http: HttpClient,
  rootUrl: string,
  params: GetAssets$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<AssetResponse>>> {

  const rb = new RequestBuilder(rootUrl, getAssets.PATH, 'get');

  if (params) {
    rb.path('ownerType', params.ownerType, {});
    rb.path('ownerId', params.ownerId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<AssetResponse>>)
  );
}

getAssets.PATH = '/api/media/owners/{ownerType}/{ownerId}';