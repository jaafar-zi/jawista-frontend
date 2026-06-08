// src/app/api/fn/media-controller/attach-existing.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { AssetResponse } from '../../models/asset-response';
import { AttachAssetRequest } from '../../models/attach-asset-request';

export interface AttachExisting$Params {
  body: AttachAssetRequest;
}

export function attachExisting(
  http: HttpClient,
  rootUrl: string,
  params: AttachExisting$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<AssetResponse>> {

  const rb = new RequestBuilder(rootUrl, attachExisting.PATH, 'post');

  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<AssetResponse>)
  );
}

attachExisting.PATH = '/api/media/attach';