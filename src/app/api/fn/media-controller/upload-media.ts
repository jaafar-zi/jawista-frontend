// src/app/api/fn/media-controller/upload-media.ts

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { FileUploadResponse } from '../../models/file-upload-response';

export interface UploadMedia$Params {
  file: Blob;
  category?: string;
  uploadedBy?: string;
}

export function uploadMedia(
  http: HttpClient,
  rootUrl: string,
  params: UploadMedia$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<FileUploadResponse>> {

  const rb = new RequestBuilder(rootUrl, uploadMedia.PATH, 'post');

  if (params) {
    rb.query('category', params.category ?? 'misc', {});
    if (params.uploadedBy) {
      rb.query('uploadedBy', params.uploadedBy, {});
    }
    rb.body({ file: params.file }, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<FileUploadResponse>)
  );
}

uploadMedia.PATH = '/api/media/upload';