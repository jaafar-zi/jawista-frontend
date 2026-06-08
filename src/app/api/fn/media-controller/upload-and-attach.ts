// src/app/api/fn/media-controller/upload-and-attach.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { AssetResponse } from '../../models/asset-response';
import { AssetOwnerType } from '../../models/asset-owner-type';
import { AssetPurpose } from '../../models/asset-purpose';

export interface UploadAndAttach$Params {
  file: Blob;
  ownerType: AssetOwnerType;
  ownerId: number;
  purpose: AssetPurpose;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
  uploadedBy?: string;
}

export function uploadAndAttach(
  http: HttpClient,
  rootUrl: string,
  params: UploadAndAttach$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<AssetResponse>> {

  const rb = new RequestBuilder(rootUrl, uploadAndAttach.PATH, 'post');

  if (params) {
    rb.query('ownerType', params.ownerType, {});
    rb.query('ownerId', params.ownerId, {});
    rb.query('purpose', params.purpose, {});
    if (params.altText != null)      rb.query('altText', params.altText, {});
    if (params.displayOrder != null) rb.query('displayOrder', params.displayOrder, {});
    if (params.isPrimary != null)    rb.query('isPrimary', params.isPrimary, {});
    if (params.uploadedBy != null)   rb.query('uploadedBy', params.uploadedBy, {});
    rb.body({ file: params.file }, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<AssetResponse>)
  );
}

uploadAndAttach.PATH = '/api/media/upload-and-attach';