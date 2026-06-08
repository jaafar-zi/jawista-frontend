// src/app/api/models/asset-response.ts

import { AssetOwnerType } from './asset-owner-type';
import { AssetPurpose } from './asset-purpose';

export interface AssetResponse {
  assetId: number;
  filePublicId: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  ownerType: AssetOwnerType;
  ownerId: number;
  purpose: AssetPurpose;
  url: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}