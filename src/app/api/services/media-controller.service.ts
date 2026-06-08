// src/app/api/services/media-controller.service.ts

/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { uploadMedia, UploadMedia$Params }
  from '../fn/media-controller/upload-media';
import { uploadAndAttach, UploadAndAttach$Params }
  from '../fn/media-controller/upload-and-attach';
import { attachExisting, AttachExisting$Params }
  from '../fn/media-controller/attach-existing';
import { getAssets, GetAssets$Params }
  from '../fn/media-controller/get-assets';
import { getPrimaryAsset, GetPrimaryAsset$Params }
  from '../fn/media-controller/get-primary-asset';
import { deleteAssetLink, DeleteAssetLink$Params }
  from '../fn/media-controller/delete-asset-link';

import { FileUploadResponse } from '../models/file-upload-response';
import { AssetResponse } from '../models/asset-response';

@Injectable({ providedIn: 'root' })
export class MediaControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── UPLOAD ───────────────────────────────────────────────────

  upload$Response(
    params: UploadMedia$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<FileUploadResponse>> {
    return uploadMedia(this.http, this.rootUrl, params, context);
  }

  upload(
    params: UploadMedia$Params,
    context?: HttpContext
  ): Observable<FileUploadResponse> {
    return this.upload$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResponse>): FileUploadResponse => r.body)
    );
  }

  // ─── UPLOAD AND ATTACH ────────────────────────────────────────

  uploadAndAttach$Response(
    params: UploadAndAttach$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AssetResponse>> {
    return uploadAndAttach(this.http, this.rootUrl, params, context);
  }

  uploadAndAttach(
    params: UploadAndAttach$Params,
    context?: HttpContext
  ): Observable<AssetResponse> {
    return this.uploadAndAttach$Response(params, context).pipe(
      map((r: StrictHttpResponse<AssetResponse>): AssetResponse => r.body)
    );
  }

  // ─── ATTACH EXISTING ─────────────────────────────────────────

  attachExisting$Response(
    params: AttachExisting$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AssetResponse>> {
    return attachExisting(this.http, this.rootUrl, params, context);
  }

  attachExisting(
    params: AttachExisting$Params,
    context?: HttpContext
  ): Observable<AssetResponse> {
    return this.attachExisting$Response(params, context).pipe(
      map((r: StrictHttpResponse<AssetResponse>): AssetResponse => r.body)
    );
  }

  // ─── GET ASSETS ───────────────────────────────────────────────

  getAssets$Response(
    params: GetAssets$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<AssetResponse>>> {
    return getAssets(this.http, this.rootUrl, params, context);
  }

  getAssets(
    params: GetAssets$Params,
    context?: HttpContext
  ): Observable<Array<AssetResponse>> {
    return this.getAssets$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AssetResponse>>): Array<AssetResponse> => r.body)
    );
  }

  // ─── GET PRIMARY ASSET ────────────────────────────────────────

  getPrimaryAsset$Response(
    params: GetPrimaryAsset$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AssetResponse>> {
    return getPrimaryAsset(this.http, this.rootUrl, params, context);
  }

  getPrimaryAsset(
    params: GetPrimaryAsset$Params,
    context?: HttpContext
  ): Observable<AssetResponse> {
    return this.getPrimaryAsset$Response(params, context).pipe(
      map((r: StrictHttpResponse<AssetResponse>): AssetResponse => r.body)
    );
  }

  // ─── DELETE ASSET LINK ────────────────────────────────────────

  deleteAssetLink$Response(
    params: DeleteAssetLink$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return deleteAssetLink(this.http, this.rootUrl, params, context);
  }

  deleteAssetLink(
    params: DeleteAssetLink$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.deleteAssetLink$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}