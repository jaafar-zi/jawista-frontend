// src/app/core/services/media.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map, tap, BehaviorSubject } from 'rxjs';

import { MediaControllerService } from '../../api/services/media-controller.service';
import { AssetResponse } from '../../api/models/asset-response';
import { AssetOwnerType } from '../../api/models/asset-owner-type';
import { AssetPurpose } from '../../api/models/asset-purpose';

@Injectable({ providedIn: 'root' })
export class MediaService {

  private readonly api = inject(MediaControllerService);

  // ── Per-owner cache ───────────────────────────────────────────
  private readonly cache = new Map<string, BehaviorSubject<AssetResponse[]>>();

  // ── Public API ────────────────────────────────────────────────

  getAssets(ownerType: AssetOwnerType, ownerId: number): Observable<AssetResponse[]> {
    return this.api.getAssets({ ownerType, ownerId }).pipe(
      catchError(err => {
        console.error(
          `[MediaService] Failed to get assets for ${ownerType}/${ownerId}:`, err
        );
        return of([]);
      })
    );
  }

  getPrimaryAsset(ownerType: AssetOwnerType, ownerId: number): Observable<AssetResponse | null> {
    return this.api.getPrimaryAsset({ ownerType, ownerId }).pipe(
      catchError(err => {
        console.error(
          `[MediaService] Failed to get primary asset for ${ownerType}/${ownerId}:`, err
        );
        return of(null);
      })
    );
  }

  uploadAndAttach(
    file: File,
    ownerType: AssetOwnerType,
    ownerId: number,
    purpose: AssetPurpose,
    options?: {
      altText?: string;
      displayOrder?: number;
      isPrimary?: boolean;
      uploadedBy?: string;
    }
  ): Observable<AssetResponse | null> {
    return this.api.uploadAndAttach({
      file,
      ownerType,
      ownerId,
      purpose,
      altText: options?.altText,
      displayOrder: options?.displayOrder,
      isPrimary: options?.isPrimary,
      uploadedBy: options?.uploadedBy
    }).pipe(
      tap(() => this.refreshCache(ownerType, ownerId)),
      catchError(err => {
        console.error(
          `[MediaService] Failed to upload for ${ownerType}/${ownerId}:`, err
        );
        return of(null);
      })
    );
  }

  deleteAssetLink(assetLinkId: number, ownerType: AssetOwnerType, ownerId: number): Observable<boolean> {
    return this.api.deleteAssetLink({ assetLinkId }).pipe(
      map(() => true),
      tap(() => this.refreshCache(ownerType, ownerId)),
      catchError(err => {
        console.error(`[MediaService] Failed to delete asset link #${assetLinkId}:`, err);
        return of(false);
      })
    );
  }

  // ── Convenience: get asset URL with fallback ──────────────────

  getAssetUrl(
    ownerType: AssetOwnerType,
    ownerId: number,
    fallbackUrl: string
  ): Observable<string> {
    return this.getAssets(ownerType, ownerId).pipe(
      map(assets => {
        if (!assets || assets.length === 0) return fallbackUrl;
        const primary = assets.find(a => a.isPrimary);
        return primary?.url ?? assets[0]?.url ?? fallbackUrl;
      })
    );
  }

  // ── Reactive Cache ────────────────────────────────────────────

  watchAssets(ownerType: AssetOwnerType, ownerId: number): Observable<AssetResponse[]> {
    const key = `${ownerType}:${ownerId}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, new BehaviorSubject<AssetResponse[]>([]));
      this.refreshCache(ownerType, ownerId);
    }
    return this.cache.get(key)!.asObservable();
  }

  // ── Private ───────────────────────────────────────────────────

  private refreshCache(ownerType: AssetOwnerType, ownerId: number): void {
    const key = `${ownerType}:${ownerId}`;
    this.getAssets(ownerType, ownerId).subscribe(assets => {
      const subject = this.cache.get(key);
      if (subject) {
        subject.next(assets);
      }
    });
  }
}