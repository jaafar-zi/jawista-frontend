// src/app/api/models/attach-asset-request.ts

import { AssetOwnerType } from './asset-owner-type';
import { AssetPurpose } from './asset-purpose';

export interface AttachAssetRequest {
  publicId: string;
  ownerType: AssetOwnerType;
  ownerId: number;
  purpose: AssetPurpose;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}