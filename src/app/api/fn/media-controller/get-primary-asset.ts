// src/app/api/fn/media-controller/get-primary-asset.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { AssetResponse } from '../../models/asset-response';
import { AssetOwnerType } from '../../models/asset-owner-type';

export interface GetPrimaryAsset$Params {
  ownerType: AssetOwnerType;
  ownerId: number;
}

export function getPrimaryAsset(
  http: HttpClient,
  rootUrl: string,
  params: GetPrimaryAsset$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<AssetResponse>> {

  const rb = new RequestBuilder(rootUrl, getPrimaryAsset.PATH, 'get');

  if (params) {
    rb.path('ownerType', params.ownerType, {});
    rb.path('ownerId', params.ownerId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<AssetResponse>)
  );
}

getPrimaryAsset.PATH = '/api/media/owners/{ownerType}/{ownerId}/primary';